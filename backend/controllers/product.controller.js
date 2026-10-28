import mongoose from 'mongoose'
import { redis } from '../lib/redis.js'
import { cachedProducts, invalidateProductCache, ttlWithJitter, FEATURED_KEY } from '../lib/productCache.js'
import cloudinary from '../lib/cloudinary.js'
import Product from '../models/product.model.js'
import { searchRegex, priceFilter } from '../lib/search.js'

export const getAllProducts = async (req, res) => {
  try {
    const products = await cachedProducts('all', {}, () => Product.find({}).lean())
    res.json({ products })
  } catch (error) {
    console.log('Error in getAllProducts controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = null
    try {
      featuredProducts = await redis.get(FEATURED_KEY)
    } catch (error) {
      console.log('Redis unavailable, falling back to MongoDB', error.message)
    }
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts))
    }

    // if not in redis, fetch from mongodb
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean()

    // store in redis for future quick access
    await redis.set(FEATURED_KEY, JSON.stringify(featuredProducts), 'EX', ttlWithJitter()).catch(() => {})

    res.json(featuredProducts)
  } catch (error) {
    console.log('Error in getFeaturedProducts controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body

    if (!name || !description || !category || !(Number(price) >= 0) || !image) {
      return res.status(400).json({ message: 'Name, description, price, category and image are required' })
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: 'products'
    })
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
      category
    })
    await invalidateProductCache()

    res.status(201).json(product)
  } catch (error) {
    console.log('Error in createProduct controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0]
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`)
        console.log('deleted image from cloduinary')
      } catch (error) {
        console.log('error deleting image from cloduinary', error)
      }
    }

    await Product.findByIdAndDelete(req.params.id)
    await invalidateProductCache()

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.log('Error in deleteProduct controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    // ?exclude=id1,id2 keeps items already in the cart out of the suggestions
    const exclude = String(req.query.exclude || '')
      .split(',')
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id))
    const products = await Product.aggregate([
      {
        $match: exclude.length ? { _id: { $nin: exclude } } : {}
      },
      {
        $sample: { size: 4 }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          botanicalName: 1,
          description: 1,
          image: 1,
          price: 1,
          category: 1,
          care: 1
        }
      }
    ])

    res.json(products)
  } catch (error) {
    console.log('Error in getRecommendedProducts controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' })
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const categorySlugToName = {
  'ornamental-houseplants': 'Ornamental Houseplants',
  'flowering-bedding-plants': 'Flowering Bedding Plants',
  'herbs-and-edible-plants': 'Herbs and Edible Plants',
  'succulents-and-cacti': 'Succulents and Cacti',
  'fruit-trees-and-bushes': 'Fruit Trees and Bushes',
  'vegetable-plants-and-seedlings': 'Vegetable Plants and Seedlings',
  'indoor-air-purifying-plants': 'Indoor Air-Purifying Plants'
}

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params
  const displayCategory = categorySlugToName[category] || category
  try {
    const products = await cachedProducts('category', displayCategory, () =>
      Product.find({ category: displayCategory }).lean()
    )
    res.json({ products })
  } catch (error) {
    console.log('Error in getProductsByCategory controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      product.isFeatured = !product.isFeatured
      const updatedProduct = await product.save()
      await invalidateProductCache()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    console.log('Error in toggleFeaturedProduct controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getSearchPriceRange = async (req, res) => {
  try {
    const { q, category } = req.query
    const query = {}
    if (q) {
      const regex = searchRegex(q)
      query.$or = [{ name: regex }, { botanicalName: regex }, { description: regex }, { category: regex }]
    }
    if (category) {
      const categories = category.split(',')
      query.category = { $in: categories }
    }

    const result = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ])

    if (result.length > 0) {
      res.json({ minPrice: result[0].minPrice, maxPrice: result[0].maxPrice })
    } else {
      res.json({ minPrice: 0, maxPrice: 0 })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query
    const query = {}
    if (q) {
      const regex = searchRegex(q)
      query.$or = [{ name: regex }, { botanicalName: regex }, { description: regex }, { category: regex }]
    }
    // the client sends a comma-separated list of categories
    if (category) query.category = { $in: category.split(',') }
    const price = priceFilter(minPrice, maxPrice)
    if (price) query.price = price
    const products = await cachedProducts('search', { q, category, minPrice, maxPrice }, () =>
      Product.find(query).sort({ isFeatured: -1, name: 1 }).limit(48).lean()
    )
    res.json(products)
  } catch (error) {
    console.log('Error in searchProducts controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

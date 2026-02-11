import Collection from "../models/collection.model.js"
import Product from "../models/product.model.js"
import cloudinary from "../lib/cloudinary.js"

export async function createCollection(req, res) {
  try {
    const { title, description, products, image } = req.body
    if (!title || !description || !Array.isArray(products) || !products.length || !image)
      return res.status(400).json({ message: "Missing required fields" })

    const foundProducts = await Product.find({ _id: { $in: products } })
    if (foundProducts.length !== products.length)
      return res.status(404).json({ message: "One or more products not found" })

    let imageUrl = image
    if (image && image.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(image, { folder: "collections" })
      imageUrl = uploadRes.secure_url
    }

    const totalPrice = foundProducts.reduce((sum, p) => sum + p.price, 0)

    const collection = await Collection.create({ title, description, products, totalPrice, image: imageUrl })
    res.status(201).json(collection)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function getAllCollections(req, res) {
  try {
    const collections = await Collection.find().populate("products")
    res.json(collections)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function getCollectionById(req, res) {
  try {
    const collection = await Collection.findById(req.params.id).populate("products")
    if (!collection) return res.status(404).json({ message: "Collection not found" })
    res.json(collection)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function updateCollection(req, res) {
  try {
    const { title, description, products, image } = req.body
    const collection = await Collection.findById(req.params.id)
    if (!collection) return res.status(404).json({ message: "Collection not found" })

    if (title) collection.title = title
    if (description) collection.description = description
    if (products && Array.isArray(products) && products.length) {
      const foundProducts = await Product.find({ _id: { $in: products } })
      if (foundProducts.length !== products.length)
        return res.status(404).json({ message: "One or more products not found" })
      collection.products = products
      collection.totalPrice = foundProducts.reduce((sum, p) => sum + p.price, 0)
    }
    if (image) {
      let imageUrl = image
      if (image.startsWith("data:")) {
        const uploadRes = await cloudinary.uploader.upload(image, { folder: "collections" })
        imageUrl = uploadRes.secure_url
      }
      collection.image = imageUrl
    }
    await collection.save()
    res.json(collection)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function deleteCollection(req, res) {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id)
    if (!collection) return res.status(404).json({ message: "Collection not found" })
    res.json({ message: "Collection deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const searchCollections = async (req, res) => {
  const { q, minPrice, maxPrice } = req.query;
  const query = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    query.$or = [{ title: regex }, { description: regex }];
  }
  if (minPrice || maxPrice) {
    query.totalPrice = {};
    if (minPrice) query.totalPrice.$gte = Number(minPrice);
    if (maxPrice) query.totalPrice.$lte = Number(maxPrice);
  }
  const collections = await Collection.find(query).limit(20);
  res.json(collections);
}; 
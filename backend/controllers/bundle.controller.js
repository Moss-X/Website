import Bundle from "../models/bundle.model.js"
import Product from "../models/product.model.js"
import cloudinary from "../lib/cloudinary.js"

export async function createBundle(req, res) {
  try {
    const { title, description, products, discountedPrice, image } = req.body
    if (!title || !description || !Array.isArray(products) || !products.length || discountedPrice == null || !image)
      return res.status(400).json({ message: "Missing required fields" })

    const foundProducts = await Product.find({ _id: { $in: products } })
    if (foundProducts.length !== products.length)
      return res.status(404).json({ message: "One or more products not found" })

    let imageUrl = image
    if (image && image.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(image, { folder: "bundles" })
      imageUrl = uploadRes.secure_url
    }

    const totalPrice = foundProducts.reduce((sum, p) => sum + p.price, 0)
    if (discountedPrice > totalPrice)
      return res.status(400).json({ message: "Discounted price cannot exceed total price" })

    const bundle = await Bundle.create({ title, description, products, totalPrice, discountedPrice, image: imageUrl })
    res.status(201).json(bundle)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function getAllBundles(req, res) {
  try {
    const bundles = await Bundle.find().populate("products")
    res.json(bundles)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function getBundleById(req, res) {
  try {
    const bundle = await Bundle.findById(req.params.id).populate("products")
    if (!bundle) return res.status(404).json({ message: "Bundle not found" })
    res.json(bundle)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function updateBundle(req, res) {
  try {
    const { title, description, products, discountedPrice, image } = req.body
    const bundle = await Bundle.findById(req.params.id)
    if (!bundle) return res.status(404).json({ message: "Bundle not found" })

    if (title) bundle.title = title
    if (description) bundle.description = description
    if (products && Array.isArray(products) && products.length) {
      const foundProducts = await Product.find({ _id: { $in: products } })
      if (foundProducts.length !== products.length)
        return res.status(404).json({ message: "One or more products not found" })
      bundle.products = products
      bundle.totalPrice = foundProducts.reduce((sum, p) => sum + p.price, 0)
    }
    if (discountedPrice != null) {
      if (discountedPrice > bundle.totalPrice)
        return res.status(400).json({ message: "Discounted price cannot exceed total price" })
      bundle.discountedPrice = discountedPrice
    }
    if (image) {
      let imageUrl = image
      if (image.startsWith("data:")) {
        const uploadRes = await cloudinary.uploader.upload(image, { folder: "bundles" })
        imageUrl = uploadRes.secure_url
      }
      bundle.image = imageUrl
    }
    await bundle.save()
    res.json(bundle)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function deleteBundle(req, res) {
  try {
    const bundle = await Bundle.findByIdAndDelete(req.params.id)
    if (!bundle) return res.status(404).json({ message: "Bundle not found" })
    res.json({ message: "Bundle deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const searchBundles = async (req, res) => {
  const { q, minPrice, maxPrice } = req.query;
  const query = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    query.$or = [{ title: regex }, { description: regex }];
  }
  if (minPrice || maxPrice) {
    query.discountedPrice = {};
    if (minPrice) query.discountedPrice.$gte = Number(minPrice);
    if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
  }
  const bundles = await Bundle.find(query).limit(20);
  res.json(bundles);
}; 
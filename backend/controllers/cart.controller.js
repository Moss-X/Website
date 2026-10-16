import mongoose from 'mongoose'
import Product from '../models/product.model.js'
import Bundle from '../models/bundle.model.js'
import Collection from '../models/collection.model.js'
import User from '../models/user.model.js'
import GuestCart from '../models/guestCart.model.js'

const MODEL_MAP = {
  product: Product,
  bundle: Bundle,
  collection: Collection
}

// Resolves stored { type, ref, quantity } entries into full documents for the client.
// Items whose product/bundle/collection was deleted are dropped.
const hydrate = async (items) => {
  const resolved = await Promise.all(
    items.map(async (item) => {
      const Model = MODEL_MAP[item.type]
      if (!Model) return null
      const query = Model.findById(item.ref)
      if (item.type !== 'product') query.populate('products', 'name image price')
      const doc = await query
      return doc ? { ...doc.toJSON(), quantity: item.quantity, type: item.type } : null
    })
  )
  return resolved.filter(Boolean)
}

const getCartItems = async (user, sessionId) => {
  if (user) return hydrate(user.cartItems)
  const guestCart = await GuestCart.findOne({ sessionId })
  return guestCart ? hydrate(guestCart.items) : []
}

export const getCartProducts = async (req, res) => {
  try {
    let cartItems = []
    if (req.user) {
      const dbUser = await User.findById(req.user._id)
      cartItems = dbUser ? await getCartItems(dbUser, null) : []
    } else {
      const sessionId = req.cookies.sessionId || req.headers['x-session-id']
      cartItems = sessionId ? await getCartItems(null, sessionId) : []
    }

    res.set('Cache-Control', 'no-store')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.json(cartItems)
  } catch (error) {
    console.error('Cart controller error:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Atomic add: bump the quantity if the item is already in the cart, otherwise push it.
// (Read-modify-save lost updates and raced on guest-cart creation when items were added quickly.)
async function addItemAtomically(Model, filter, field, refId, type) {
  const bumped = await Model.updateOne(
    { ...filter, [field]: { $elemMatch: { ref: refId, type } } },
    { $inc: { [`${field}.$.quantity`]: 1 } }
  )
  if (bumped.matchedCount) return
  const push = () =>
    Model.updateOne(filter, { $push: { [field]: { ref: refId, type, quantity: 1 } } }, { upsert: Model === GuestCart })
  try {
    await push()
  } catch (error) {
    // two concurrent upserts for a brand-new guest cart: the loser retries against the winner's doc
    if (error.code === 11000) await push()
    else throw error
  }
}

export const addToCart = async (req, res) => {
  try {
    const { refId, type } = req.body
    const sessionId = req.cookies.sessionId || req.headers['x-session-id']

    if (!refId || !type || !MODEL_MAP[type] || !mongoose.isValidObjectId(refId)) {
      return res.status(400).json({ message: 'Invalid cart item type or refId' })
    }

    const doc = await MODEL_MAP[type].exists({ _id: refId })
    if (!doc) {
      return res.status(404).json({ message: 'Item not found' })
    }

    if (req.user) {
      await addItemAtomically(User, { _id: req.user._id }, 'cartItems', refId, type)
    } else {
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required for guest cart' })
      }
      await addItemAtomically(GuestCart, { sessionId }, 'items', refId, type)
    }
    res.json({ message: 'Added to cart' })
  } catch (error) {
    console.error('Cart controller error:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const removeAllFromCart = async (req, res) => {
  try {
    const { refId, type } = req.body
    const sessionId = req.cookies.sessionId || req.headers['x-session-id']

    if (req.user) {
      const user = req.user
      if (!refId || !type) {
        user.cartItems = []
      } else {
        const initialLength = user.cartItems.length
        user.cartItems = user.cartItems.filter((item) => !(item.ref.toString() === refId && item.type === type))
      }
      await user.save()
      res.json(user.cartItems)
    } else {
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required for guest cart' })
      }

      const guestCart = await GuestCart.findOne({ sessionId })
      if (!guestCart) {
        return res.json([])
      }

      if (!refId || !type) {
        guestCart.items = []
      } else {
        guestCart.items = guestCart.items.filter((item) => !(item.ref.toString() === refId && item.type === type))
      }

      await guestCart.save()
      res.json(guestCart.items)
    }
  } catch (error) {
    console.error('Error in removeAllFromCart:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const updateQuantity = async (req, res) => {
  try {
    const { refId, type } = req.body
    const quantity = Number(req.body.quantity)
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
      return res.status(400).json({ message: 'Quantity must be a whole number between 0 and 99' })
    }
    const sessionId = req.cookies.sessionId || req.headers['x-session-id']

    if (req.user) {
      const user = req.user
      const existingItem = user.cartItems.find((item) => item.ref.toString() === refId && item.type === type)

      if (existingItem) {
        if (quantity === 0) {
          user.cartItems = user.cartItems.filter((item) => !(item.ref.toString() === refId && item.type === type))
          await user.save()
          return res.json(user.cartItems)
        }
        existingItem.quantity = quantity
        await user.save()
        res.json(user.cartItems)
      } else {
        res.status(404).json({ message: 'Cart item not found' })
      }
    } else {
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required for guest cart' })
      }

      const guestCart = await GuestCart.findOne({ sessionId })
      if (!guestCart) {
        return res.status(404).json({ message: 'Guest cart not found' })
      }

      const existingItem = guestCart.items.find((item) => item.ref.toString() === refId && item.type === type)
      if (existingItem) {
        if (quantity === 0) {
          guestCart.items = guestCart.items.filter((item) => !(item.ref.toString() === refId && item.type === type))
          await guestCart.save()
          return res.json(guestCart.items)
        }
        existingItem.quantity = quantity
        await guestCart.save()
        res.json(guestCart.items)
      } else {
        res.status(404).json({ message: 'Cart item not found' })
      }
    }
  } catch (error) {
    console.error('Cart controller error:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const mergeGuestCart = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id']
    if (!sessionId) {
      return res.json({ message: 'No guest cart to merge' })
    }

    const guestCart = await GuestCart.findOne({ sessionId })
    if (!guestCart || guestCart.items.length === 0) {
      return res.json({ message: 'No guest cart items to merge' })
    }

    const user = req.user

    for (const guestItem of guestCart.items) {
      const existingItem = user.cartItems.find((item) => item.ref.equals(guestItem.ref) && item.type === guestItem.type)
      if (existingItem) {
        existingItem.quantity += guestItem.quantity
      } else {
        user.cartItems.push({
          ref: guestItem.ref,
          type: guestItem.type,
          quantity: guestItem.quantity
        })
      }
    }

    await user.save()

    await GuestCart.findOneAndDelete({ sessionId })

    res.json({
      message: 'Guest cart merged successfully',
      cartItems: user.cartItems
    })
  } catch (error) {
    console.error('Cart controller error:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

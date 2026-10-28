import crypto from 'crypto'
import Coupon from '../models/coupon.model.js'
import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import Bundle from '../models/bundle.model.js'
import Collection from '../models/collection.model.js'
import { razorpay } from '../lib/razorpay.js'
import { markOrderPaid } from '../lib/orderPayment.js'

const PRICED_MODELS = {
  product: { Model: Product, price: (d) => d.price, name: (d) => d.name },
  bundle: { Model: Bundle, price: (d) => d.discountedPrice, name: (d) => d.title },
  collection: { Model: Collection, price: (d) => d.totalPrice, name: (d) => d.title }
}

// Never trust prices from the client: look every item up and price it from the database.
async function priceCart(items) {
  const lineItems = []
  for (const item of items) {
    const type = item.type || 'product'
    const priced = PRICED_MODELS[type]
    const quantity = Number(item.quantity)
    if (!priced || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw Object.assign(new Error('Invalid cart item'), { status: 400 })
    }
    const doc = await priced.Model.findById(item._id).lean()
    if (!doc) throw Object.assign(new Error('An item in your cart is no longer available'), { status: 400 })
    lineItems.push({ product: doc._id, itemType: type, name: priced.name(doc), quantity, price: priced.price(doc) })
  }
  return lineItems
}

const REQUIRED_ADDRESS_FIELDS = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode']

export const createRazorpayOrder = async (req, res) => {
  try {
    const { products, couponCode, shippingAddress } = req.body

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' })
    }
    if (!shippingAddress || REQUIRED_ADDRESS_FIELDS.some((f) => !String(shippingAddress[f] || '').trim())) {
      return res.status(400).json({ message: 'Complete shipping address is required' })
    }

    const lineItems = await priceCart(products)
    const subtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    let discountAmount = 0
    let appliedCoupon = null
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true })
      if (coupon && coupon.expirationDate > new Date()) {
        discountAmount = (subtotal * coupon.discountPercentage) / 100
        appliedCoupon = coupon.code
      }
    }

    const totalAmount = Math.round((subtotal - discountAmount) * 100) / 100
    const amountInPaise = Math.round(totalAmount * 100)
    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ message: 'Invalid order amount' })
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { userId: req.user._id.toString(), couponCode: appliedCoupon || '' }
    })

    // Kept as pending until the payment signature is verified.
    await Order.create({
      user: req.user._id,
      products: lineItems,
      totalAmount,
      shippingAddress: {
        ...Object.fromEntries(REQUIRED_ADDRESS_FIELDS.map((f) => [f, String(shippingAddress[f]).trim()])),
        addressLine2: shippingAddress.addressLine2 || '',
        country: 'India'
      },
      couponCode: appliedCoupon,
      status: 'pending',
      razorpayOrderId: razorpayOrder.id
    })

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
      totalAmount,
      discountAmount
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    res.status(error.status || 500).json({ message: error.status ? error.message : 'Could not start checkout' })
  }
}

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const valid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature))
    if (!valid) {
      return res.status(400).json({ message: 'Invalid payment signature' })
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.status === 'paid') return res.json({ success: true, orderId: order._id })

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id)
    if (razorpayOrder.status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' })
    }

    // Only the caller that wins the pending -> paid flip runs the side effects; a loser means the
    // webhook or a retry got there first, which is still a successful payment.
    await markOrderPaid({ _id: order._id }, razorpay_payment_id)

    res.status(200).json({ success: true, orderId: order._id })
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    res.status(500).json({ message: 'Error verifying payment' })
  }
}

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id, status: 'paid' }).lean()
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({
      _id: order._id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.products.map((p) => ({ name: p.name, quantity: p.quantity, price: p.price })),
      shippingAddress: order.shippingAddress
    })
  } catch {
    res.status(404).json({ message: 'Order not found' })
  }
}

export const getRazorpayKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
}

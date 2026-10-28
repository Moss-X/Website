import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'

import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import bundleRoutes from './routes/bundle.route.js'
import collectionRoutes from './routes/collection.route.js'

import { razorpayWebhook } from './controllers/webhook.controller.js'
import { connectDB } from './lib/db.js'
import { startOrderReconciler } from './lib/reconcileOrders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

// The webhook signature covers the raw bytes, so this route must be registered before express.json.
app.post('/api/payments/webhook', express.raw({ type: 'application/json', limit: '1mb' }), razorpayWebhook)

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/bundles', bundleRoutes)
app.use('/api/collections', collectionRoutes)

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  })
})

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found' })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
  connectDB().then(startOrderReconciler)
})

import express from 'express'
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
  mergeGuestCart
} from '../controllers/cart.controller.js'
import { protectRoute, optionalAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

// Health check route
router.get('/health', (req, res) => {
  res.json({
    message: 'Cart service is working',
    timestamp: new Date().toISOString(),
    sessionId: req.headers['x-session-id'] || 'none'
  })
})

// Cart operations - optional authentication (handles both guest and logged-in users)
router.get('/', optionalAuth, getCartProducts)
router.post('/', optionalAuth, addToCart)
router.delete('/', optionalAuth, removeAllFromCart)
router.put('/:id', optionalAuth, updateQuantity)

// Merge guest cart with user cart after login - requires authentication
router.post('/merge', protectRoute, mergeGuestCart)

export default router

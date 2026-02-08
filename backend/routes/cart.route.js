import express from 'express';
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
  mergeGuestCart,
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    message: 'Cart service is working',
    timestamp: new Date().toISOString(),
    sessionId: req.headers['x-session-id'] || 'none',
  });
});

// Cart operations - no authentication required (guest users can use cart)
router.get('/', getCartProducts);
router.post('/', addToCart);
router.delete('/', removeAllFromCart);
router.put('/:id', updateQuantity);

// Merge guest cart with user cart after login - requires authentication
router.post('/merge', protectRoute, mergeGuestCart);

export default router;

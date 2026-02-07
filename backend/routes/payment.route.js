import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
} from '../controllers/razorpay.controller.js';

const router = express.Router();

router.post('/create-razorpay-order', protectRoute, createRazorpayOrder);
router.post('/verify-razorpay-payment', protectRoute, verifyRazorpayPayment);
router.get('/razorpay-key', getRazorpayKey);

export default router;

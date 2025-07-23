import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } from "../controllers/razorpay.controller.js";

const router = express.Router();

// Stripe routes (existing)
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

// Razorpay routes (new)
router.post("/create-razorpay-order", protectRoute, createRazorpayOrder);
router.post("/verify-razorpay-payment", protectRoute, verifyRazorpayPayment);
router.get("/razorpay-key", getRazorpayKey);

export default router;

import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { razorpay } from "../lib/razorpay.js";
import crypto from "crypto";

export const createRazorpayOrder = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		// Calculate total amount
		products.forEach((product) => {
    const price = Number(product.price) || 0;
    const qty = Number(product.quantity) || 1;
    totalAmount += price * qty;
  });

		let coupon = null;
		let discountAmount = 0;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				discountAmount = (totalAmount * coupon.discountPercentage) / 100;
				totalAmount -= discountAmount;
			}
		}

		// Razorpay expects amount in paise (smallest currency unit)
		const amountInPaise = Math.round(Number(totalAmount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ error: "Invalid amount calculated" });
    }

		const options = {
			amount: amountInPaise,
			currency: "INR",
			receipt: `order_${Date.now()}`,
			notes: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
				discountAmount: discountAmount.toString(),
			},
		};

		const razorpayOrder = await razorpay.orders.create(options);

		// Create new coupon if order value is >= 200 INR (equivalent to $20)
		if (totalAmount >= 200) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({
			orderId: razorpayOrder.id,
			amount: amountInPaise,
			currency: razorpayOrder.currency,
			totalAmount: totalAmount,
			discountAmount: discountAmount,
		});
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
	}
};

export const verifyRazorpayPayment = async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

		// Verify the payment signature
		const body = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(body.toString())
			.digest("hex");

		if (expectedSignature !== razorpay_signature) {
			return res.status(400).json({ error: "Invalid payment signature" });
		}

		// Fetch the order details from Razorpay
		const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
		
		if (razorpayOrder.status === "paid") {
			// Deactivate coupon if used
			if (razorpayOrder.notes.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: razorpayOrder.notes.couponCode,
						userId: razorpayOrder.notes.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// Create a new Order in database
			const products = JSON.parse(razorpayOrder.notes.products);
			const newOrder = new Order({
				user: razorpayOrder.notes.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: razorpayOrder.amount / 100, // convert from paise to rupees
				razorpayOrderId: razorpay_order_id,
				razorpayPaymentId: razorpay_payment_id,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment verified successfully, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		} else {
			res.status(400).json({ error: "Payment not completed" });
		}
	} catch (error) {
		console.error("Error verifying Razorpay payment:", error);
		res.status(500).json({ message: "Error verifying payment", error: error.message });
	}
};

export const getRazorpayKey = async (req, res) => {
	try {
		res.status(200).json({
			key: process.env.RAZORPAY_KEY_ID,
		});
	} catch (error) {
		console.error("Error fetching Razorpay key:", error);
		res.status(500).json({ message: "Error fetching Razorpay key", error: error.message });
	}
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

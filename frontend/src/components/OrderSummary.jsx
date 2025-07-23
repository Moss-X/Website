import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import { useState, useEffect } from "react";

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const [razorpayKey, setRazorpayKey] = useState("");
	const [loading, setLoading] = useState(false);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	useEffect(() => {
		const fetchRazorpayKey = async () => {
			try {
				const response = await axios.get("/payments/razorpay-key");
				setRazorpayKey(response.data.key);
			} catch (error) {
				console.error("Error fetching Razorpay key:", error);
			}
		};
		fetchRazorpayKey();
	}, []);

	const handlePayment = async () => {
		if (!razorpayKey) {
			console.error("Razorpay key not loaded");
			return;
		}

		setLoading(true);
		try {
			// Create Razorpay order
			const transformed = cart.map((item) => {
        if (item.type === "bundle") return { ...item, price: item.discountedPrice };
        if (item.type === "collection") return { ...item, price: item.totalPrice };
        return item; // product already has price
      });

      const orderResponse = await axios.post("/payments/create-razorpay-order", {
        products: transformed,
        couponCode: coupon ? coupon.code : null,
      });

			const { orderId, amount, currency } = orderResponse.data;

			// Load Razorpay script dynamically
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => {
				const options = {
					key: razorpayKey,
					amount: amount,
					currency: currency,
					name: "Moss X Store",
					description: "Purchase from Moss X",
					order_id: orderId,
					handler: async (response) => {
						try {
							// Verify payment
							const verifyResponse = await axios.post("/payments/verify-razorpay-payment", {
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
							});

							if (verifyResponse.data.success) {
								// Redirect to success page
								window.location.href = `/purchase-success?order_id=${verifyResponse.data.orderId}`;
							} else {
								window.location.href = "/purchase-cancel?reason=verification_failed";
							}
						} catch (error) {
							console.error("Error verifying payment:", error);
          window.location.href = "/purchase-cancel?reason=verify_error";
						}
					},
					prefill: {
						name: "Customer",
						email: "customer@example.com",
						contact: "9999999999",
					},
					theme: {
						color: "#10b981",
					},
					modal: {
						ondismiss: () => {
            setLoading(false);
          },
					},
				};

				const rzp = new window.Razorpay(options);
				rzp.open();
			};
			document.head.appendChild(script);
		} catch (error) {
			console.error("Error creating order:", error);
			setLoading(false);
		}
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>₹{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-₹{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>₹{formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed'
					whileHover={{ scale: loading ? 1 : 1.05 }}
					whileTap={{ scale: loading ? 1 : 0.95 }}
					onClick={handlePayment}
					disabled={loading || !razorpayKey}
				>
					{loading ? "Processing..." : "Proceed to Checkout"}
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;

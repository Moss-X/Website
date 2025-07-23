import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		// Keeping for legacy reference but ensure it doesn’t cause duplicate-key errors
		// stripeSessionId: {
		// 	type: String,
		// 	unique: true,
		// 	sparse: true,
		// 	default: undefined,
		// },
		razorpayOrderId: {
			type: String,
			unique: true,
			sparse: true,
		},
		razorpayPaymentId: {
			type: String,
			unique: true,
			sparse: true,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

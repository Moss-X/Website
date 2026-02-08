import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
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
    // Address fields - required for delivery
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Full name is required for delivery'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required for delivery'],
      },
      addressLine1: {
        type: String,
        required: [true, 'Address line 1 is required for delivery'],
      },
      addressLine2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: [true, 'City is required for delivery'],
      },
      state: {
        type: String,
        required: [true, 'State is required for delivery'],
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required for delivery'],
      },
      country: {
        type: String,
        required: [true, 'Country is required for delivery'],
        default: 'India',
      },
    },
    // Keeping for legacy reference but ensure it doesn't cause duplicate-key errors
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

const Order = mongoose.model('Order', orderSchema);

export default Order;

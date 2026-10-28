import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        // bundles and collections are stored as a single line item referencing their own id
        itemType: {
          type: String,
          enum: ['product', 'bundle', 'collection'],
          default: 'product'
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    // Address fields - required for delivery
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Full name is required for delivery']
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required for delivery']
      },
      addressLine1: {
        type: String,
        required: [true, 'Address line 1 is required for delivery']
      },
      addressLine2: {
        type: String,
        required: false
      },
      city: {
        type: String,
        required: [true, 'City is required for delivery']
      },
      state: {
        type: String,
        required: [true, 'State is required for delivery']
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required for delivery']
      },
      country: {
        type: String,
        required: [true, 'Country is required for delivery'],
        default: 'India'
      }
    },
    // Keeping for legacy reference but ensure it doesn't cause duplicate-key errors
    // stripeSessionId: {
    // 	type: String,
    // 	unique: true,
    // 	sparse: true,
    // 	default: undefined,
    // },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'paid'
    },
    couponCode: String,
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    // Client-supplied Idempotency-Key for checkout; a retry with the same key returns this order.
    idempotencyKey: {
      type: String,
      maxlength: 128
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
)

// Scoped per user so one customer's key can never collide with another's.
orderSchema.index(
  { user: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } }
)

const Order = mongoose.model('Order', orderSchema)

export default Order

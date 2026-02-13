import mongoose from 'mongoose'

const guestCartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    items: [
      {
        type: {
          type: String,
          enum: ['product', 'bundle', 'collection'],
          required: true
        },
        ref: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'items.type'
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        }
      }
    ],
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 7 * 24 * 60 * 60 // 7 days
    }
  },
  { timestamps: true }
)

const GuestCart = mongoose.model('GuestCart', guestCartSchema)

export default GuestCart

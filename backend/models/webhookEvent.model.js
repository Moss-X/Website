import mongoose from 'mongoose'

// One row per Razorpay webhook delivery; the unique eventId is what dedupes retries.
const webhookEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    event: { type: String, required: true }
  },
  { timestamps: true }
)

// Razorpay retries for up to 24h, so a week of history is plenty.
webhookEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 })

const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema)

export default WebhookEvent

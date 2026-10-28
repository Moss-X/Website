import crypto from 'crypto'
import Order from '../models/order.model.js'
import WebhookEvent from '../models/webhookEvent.model.js'
import { markOrderPaid } from '../lib/orderPayment.js'

const PAID_EVENTS = new Set(['payment.captured', 'order.paid'])

// Must be given the raw request body: the signature is computed over the exact bytes Razorpay sent.
export function isValidWebhookSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

async function handlePaid(payload) {
  const payment = payload.payment?.entity
  const razorpayOrderId = payment?.order_id || payload.order?.entity?.id
  if (!payment?.id || !razorpayOrderId) return

  const order = await Order.findOne({ razorpayOrderId }).lean()
  if (!order) return
  // Never trust the event over our own record of what the customer should have paid.
  if (payment.amount !== Math.round(order.totalAmount * 100)) {
    console.error(`Webhook amount mismatch for ${razorpayOrderId}: got ${payment.amount}`)
    return
  }
  await markOrderPaid({ _id: order._id }, payment.id)
}

export const razorpayWebhook = async (req, res) => {
  const signature = req.get('X-Razorpay-Signature')
  if (
    !Buffer.isBuffer(req.body) ||
    !isValidWebhookSignature(req.body, signature, process.env.RAZORPAY_WEBHOOK_SECRET)
  ) {
    return res.status(400).json({ message: 'Invalid signature' })
  }

  const eventId = req.get('X-Razorpay-Event-Id')
  let body
  try {
    body = JSON.parse(req.body.toString('utf8'))
  } catch {
    return res.status(400).json({ message: 'Invalid payload' })
  }
  if (!eventId) return res.status(400).json({ message: 'Missing event id' })

  try {
    await WebhookEvent.create({ eventId, event: body.event })
  } catch (error) {
    // Already seen this delivery: acknowledge so Razorpay stops retrying.
    if (error.code === 11000) return res.status(200).json({ received: true, duplicate: true })
    console.error('Error recording webhook event:', error)
    return res.status(500).json({ message: 'Webhook failed' })
  }

  try {
    if (PAID_EVENTS.has(body.event)) await handlePaid(body.payload || {})
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    // Forget the event so Razorpay's retry gets processed instead of being skipped as a duplicate.
    await WebhookEvent.deleteOne({ eventId }).catch(() => {})
    res.status(500).json({ message: 'Webhook failed' })
  }
}

import Order from '../models/order.model.js'
import { razorpay } from './razorpay.js'
import { markOrderPaid } from './orderPayment.js'

const PENDING_AFTER_MS = 15 * 60 * 1000
const GIVE_UP_AFTER_MS = 7 * 24 * 60 * 60 * 1000
const RUN_EVERY_MS = 5 * 60 * 1000
const BATCH_SIZE = 50

// Safety net for a missed webhook and a closed browser tab: any order still pending after 15 minutes
// is checked against Razorpay and flipped to paid if the money actually arrived.
export async function reconcilePendingOrders() {
  const now = Date.now()
  const stale = await Order.find({
    status: 'pending',
    razorpayOrderId: { $exists: true },
    createdAt: { $lte: new Date(now - PENDING_AFTER_MS), $gte: new Date(now - GIVE_UP_AFTER_MS) }
  })
    .sort({ createdAt: 1 })
    .limit(BATCH_SIZE)
    .lean()

  let reconciled = 0
  for (const order of stale) {
    try {
      const remote = await razorpay.orders.fetch(order.razorpayOrderId)
      if (remote.status !== 'paid') continue
      const { items } = await razorpay.orders.fetchPayments(order.razorpayOrderId)
      const captured = items.find((p) => p.status === 'captured')
      if (!captured) continue
      if (await markOrderPaid({ _id: order._id }, captured.id)) reconciled++
    } catch (error) {
      console.error(`Could not reconcile order ${order._id}:`, error.message)
    }
  }
  return { checked: stale.length, reconciled }
}

export function startOrderReconciler() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null
  let running = false
  const timer = setInterval(async () => {
    if (running) return
    running = true
    try {
      const { checked, reconciled } = await reconcilePendingOrders()
      if (reconciled) console.log(`Reconciled ${reconciled}/${checked} pending orders`)
    } catch (error) {
      console.error('Order reconciliation failed:', error.message)
    } finally {
      running = false
    }
  }, RUN_EVERY_MS)
  timer.unref()
  return timer
}

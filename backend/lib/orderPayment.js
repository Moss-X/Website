import crypto from 'crypto'
import Coupon from '../models/coupon.model.js'
import Order from '../models/order.model.js'
import User from '../models/user.model.js'

// Orders at or above this value earn a 10% gift coupon for the next purchase.
export const GIFT_COUPON_THRESHOLD = 999

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId })
  return Coupon.create({
    code: 'GIFT' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId
  })
}

// Flips a pending order to paid. The status filter makes the transition atomic, so when the
// browser callback, the webhook and the reconciler race, exactly one caller wins and runs the
// side effects. Returns the updated order for the winner and null for everyone else.
export async function markOrderPaid(filter, razorpayPaymentId) {
  const order = await Order.findOneAndUpdate(
    { ...filter, status: 'pending' },
    { $set: { status: 'paid', razorpayPaymentId } },
    { new: true }
  )
  if (!order) return null

  if (order.couponCode) {
    await Coupon.findOneAndUpdate({ code: order.couponCode, userId: order.user }, { isActive: false })
  }
  if (order.totalAmount >= GIFT_COUPON_THRESHOLD) {
    await createNewCoupon(order.user)
  }
  await User.updateOne({ _id: order.user }, { $set: { cartItems: [] } })
  return order
}

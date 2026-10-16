import { useEffect, useState } from 'react'
import { Ticket } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'
import { useUserStore } from '../stores/useUserStore'

const GiftCouponCard = () => {
  const user = useUserStore((s) => s.user)
  const [code, setCode] = useState('')
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore()

  useEffect(() => {
    if (user) getMyCoupon()
  }, [getMyCoupon, user])

  if (!user) return null

  return (
    <section aria-labelledby="coupon-heading" className="rounded-3xl border border-line bg-surface p-6">
      <h2 id="coupon-heading" className="mb-3 flex items-center gap-2 font-bold">
        <Ticket className="h-5 w-5 text-moss" aria-hidden="true" />
        Gift card or coupon
      </h2>
      {isCouponApplied && coupon ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-sage px-4 py-3">
          <span>
            <span className="font-bold">{coupon.code}</span> · {coupon.discountPercentage}% off applied
          </span>
          <button type="button" onClick={removeCoupon} className="text-sm font-bold underline hover:text-clay">
            Remove
          </button>
        </div>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (code.trim()) applyCoupon(code.trim())
          }}
        >
          <label htmlFor="voucher" className="sr-only">
            Coupon code
          </label>
          <input
            id="voucher"
            type="text"
            className="field flex-1 uppercase placeholder:normal-case"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn-outline h-11 px-5">
            Apply
          </button>
        </form>
      )}
      {coupon && !isCouponApplied && (
        <p className="mt-3 text-sm text-muted">
          You have a coupon:{' '}
          <button type="button" className="font-bold text-moss underline" onClick={() => applyCoupon(coupon.code)}>
            {coupon.code}
          </button>{' '}
          for {coupon.discountPercentage}% off.
        </p>
      )}
    </section>
  )
}
export default GiftCouponCard

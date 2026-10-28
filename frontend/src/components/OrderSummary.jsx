import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, MapPin, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from '../lib/axios'
import { useCartStore } from '../stores/useCartStore'
import { useUserStore } from '../stores/useUserStore'
import { formatCurrency } from '../utils/formatCurrency'
import ShippingAddressForm from './ShippingAddressForm'

let razorpayScript
const loadRazorpay = () =>
  (razorpayScript ||= new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = resolve
    script.onerror = () => {
      razorpayScript = null
      reject(new Error('Could not load Razorpay'))
    }
    document.head.appendChild(script)
  }))

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart, shippingAddress, setShippingAddress } = useCartStore()
  const { user } = useUserStore()
  const [razorpayKey, setRazorpayKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const savings = subtotal - total

  useEffect(() => {
    axios
      .get('/payments/razorpay-key')
      .then((res) => setRazorpayKey(res.data.key))
      .catch(() => setRazorpayKey(''))
  }, [])

  useEffect(() => {
    if (!showAddressForm) return
    const onKey = (e) => e.key === 'Escape' && setShowAddressForm(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showAddressForm])

  // Reused while the cart, coupon and address are unchanged, so a double click or a retry after a
  // network drop resolves to the same server-side order instead of creating another one.
  const checkoutAttempt = useRef({ fingerprint: null, key: null })
  const idempotencyKeyFor = (payload) => {
    const fingerprint = JSON.stringify(payload)
    if (checkoutAttempt.current.fingerprint !== fingerprint) {
      checkoutAttempt.current = { fingerprint, key: crypto.randomUUID() }
    }
    return checkoutAttempt.current.key
  }

  const handlePayment = async () => {
    if (!shippingAddress) return setShowAddressForm(true)
    if (!razorpayKey) return toast.error('Payments are not configured right now')

    setLoading(true)
    try {
      await loadRazorpay()
      // The server prices every item itself; only ids, types and quantities are sent.
      const payload = {
        products: cart.map(({ _id, type, quantity }) => ({ _id, type, quantity })),
        couponCode: coupon && isCouponApplied ? coupon.code : null,
        shippingAddress
      }
      const { data } = await axios.post('/payments/create-razorpay-order', payload, {
        headers: { 'Idempotency-Key': idempotencyKeyFor(payload) }
      })

      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: 'Moss X',
        description: `${cart.length} item${cart.length === 1 ? '' : 's'}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verify = await axios.post('/payments/verify-razorpay-payment', response)
            window.location.href = `/purchase-success?order_id=${verify.data.orderId}`
          } catch {
            window.location.href = '/purchase-cancel?reason=verify_error'
          }
        },
        prefill: { name: shippingAddress.fullName, email: user.email, contact: shippingAddress.phone },
        theme: { color: '#4F6A47' },
        modal: { ondismiss: () => setLoading(false) }
      })
      rzp.on('payment.failed', () => toast.error('Payment failed. You have not been charged.'))
      rzp.open()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not start checkout')
      setLoading(false)
    }
  }

  return (
    <section
      aria-labelledby="summary-heading"
      className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6"
    >
      <h2 id="summary-heading" className="heading-display text-2xl">
        Order summary
      </h2>

      <dl className="flex flex-col gap-2.5 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">Coupon ({coupon.code})</dt>
            <dd className="text-moss tabular-nums">−{formatCurrency(Math.round(savings * 100) / 100)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="text-moss">Free</dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-bold">Total</dt>
          <dd className="font-display text-2xl font-semibold tabular-nums">
            {formatCurrency(Math.round(total * 100) / 100)}
          </dd>
        </div>
      </dl>

      {user && shippingAddress && (
        <div className="flex items-start gap-3 rounded-2xl bg-ground p-4 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
          <div className="flex-1 leading-relaxed">
            <p className="font-bold">{shippingAddress.fullName}</p>
            <p>
              {shippingAddress.addressLine1}
              {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
            </p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
            </p>
            <p className="text-muted">{shippingAddress.phone}</p>
          </div>
          <button type="button" onClick={() => setShowAddressForm(true)} className="font-bold text-moss underline">
            Edit
          </button>
        </div>
      )}

      {!user ? (
        <Link to="/login" className="btn-primary h-[52px]">
          Sign in to check out
        </Link>
      ) : !shippingAddress ? (
        <button type="button" onClick={() => setShowAddressForm(true)} className="btn-primary h-[52px]">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Add delivery address
        </button>
      ) : (
        <button type="button" className="btn-primary h-[52px]" onClick={handlePayment} disabled={loading}>
          <Lock className="h-4 w-4" aria-hidden="true" />
          {loading ? 'Opening secure checkout…' : `Pay ${formatCurrency(Math.round(total * 100) / 100)}`}
        </button>
      )}
      {!user && <p className="-mt-2 text-center text-sm text-muted">Your cart will be saved to your account.</p>}

      {showAddressForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setShowAddressForm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-heading"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-surface p-6 sm:rounded-3xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 id="address-heading" className="heading-display text-2xl">
                Delivery address
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sage"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ShippingAddressForm
              initial={shippingAddress || user?.defaultAddress}
              onAddressSubmit={(address) => {
                setShippingAddress(address)
                setShowAddressForm(false)
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
export default OrderSummary

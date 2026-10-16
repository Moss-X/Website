import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Confetti from 'react-confetti'
import { useCartStore } from '../stores/useCartStore'
import { useFetch } from '../hooks/useFetch'
import { formatCurrency } from '../utils/formatCurrency'

const PurchaseSuccessPage = () => {
  const orderId = new URLSearchParams(window.location.search).get('order_id')
  const { data: order, loading, error } = useFetch(orderId ? `/payments/orders/${orderId}` : null)
  const { clearCart, getMyCoupon } = useCartStore()
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    // the server already emptied the cart when it verified payment; sync local state
    if (order) {
      clearCart()
      getMyCoupon()
    }
  }, [order, clearCart, getMyCoupon])

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (loading) {
    return <div className="container-page py-24 text-center text-muted">Confirming your order…</div>
  }

  if (!orderId || error || !order) {
    return (
      <section className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="heading-display text-4xl">We couldn&apos;t find that order</h1>
        <p className="max-w-md text-muted">
          If you were charged, your order is safe — it can take a moment to appear. Contact us with your payment
          reference if you need help.
        </p>
        <Link to="/" className="btn-primary">
          Back to the shop
        </Link>
      </section>
    )
  }

  return (
    <section className="container-page flex justify-center py-16 sm:py-24">
      <Confetti
        width={size.w}
        height={size.h}
        gravity={0.12}
        numberOfPieces={400}
        recycle={false}
        style={{ position: 'fixed', zIndex: 60 }}
        colors={['#4F6A47', '#C0D3BB', '#B4532A', '#E3EBDF', '#07592C']}
      />
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-moss" aria-hidden="true" />
        <h1 className="heading-display mb-2 text-4xl">Thank you!</h1>
        <p className="mb-8 text-muted">Your order is confirmed and your plants are being prepared.</p>

        <dl className="mb-6 flex flex-col gap-2 rounded-2xl bg-ground p-5 text-left text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Order number</dt>
            <dd className="font-mono font-bold">#{String(order._id).slice(-8).toUpperCase()}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Amount paid</dt>
            <dd className="font-bold">{formatCurrency(order.totalAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Deliver to</dt>
            <dd className="text-right">
              {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
            </dd>
          </div>
        </dl>

        <ul className="mb-8 divide-y divide-line text-left text-[15px]">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-4 py-2.5">
              <span>
                {item.name} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <Link to="/" className="btn-primary w-full">
          Continue shopping
        </Link>
      </div>
    </section>
  )
}
export default PurchaseSuccessPage

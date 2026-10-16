import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

const PurchaseCancelPage = () => {
  const reason = new URLSearchParams(window.location.search).get('reason')
  return (
    <section className="container-page flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 text-center sm:p-10">
        <XCircle className="mx-auto mb-4 h-14 w-14 text-clay" aria-hidden="true" />
        <h1 className="heading-display mb-2 text-4xl">Payment not completed</h1>
        <p className="mb-6 text-muted">
          {reason === 'verify_error'
            ? "We couldn't confirm your payment. If money was deducted it will be refunded automatically by your bank."
            : 'Your order was cancelled and no charges were made.'}
        </p>
        <p className="mb-8 rounded-2xl bg-ground p-4 text-sm text-muted">
          Your cart has been kept so you can try again.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/cart" className="btn-primary">
            Back to cart
          </Link>
          <Link to="/" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PurchaseCancelPage

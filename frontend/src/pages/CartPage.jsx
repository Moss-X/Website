import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'
import CartItem from '../components/CartItem'
import PeopleAlsoBought from '../components/PeopleAlsoBought'
import OrderSummary from '../components/OrderSummary'
import GiftCouponCard from '../components/GiftCouponCard'

const CartPage = () => {
  const { cart, loading } = useCartStore()
  const count = cart.reduce((n, i) => n + i.quantity, 0)

  if (loading && !cart.length) {
    return (
      <div className="container-page py-16" aria-busy="true">
        <div className="h-12 w-60 animate-pulse rounded-2xl bg-placeholder" />
        <div className="mt-8 h-40 animate-pulse rounded-3xl bg-placeholder" />
      </div>
    )
  }

  if (!cart.length) {
    return (
      <section className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sage">
          <ShoppingBag className="h-9 w-9 text-moss" aria-hidden="true" />
        </span>
        <h1 className="heading-display text-4xl">Your cart is empty</h1>
        <p className="max-w-sm text-muted">
          Find a plant that suits your light and routine — every listing has care notes.
        </p>
        <Link className="btn-primary mt-2" to="/search">
          Browse plants
        </Link>
      </section>
    )
  }

  return (
    <div className="container-page pt-10 pb-24">
      <h1 className="heading-display mb-2 text-[40px] sm:text-[44px]">Your cart</h1>
      <p className="mb-6 text-muted">
        {count} item{count === 1 ? '' : 's'}
      </p>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {cart.map((item) => (
              <CartItem key={`${item.type}-${item._id}`} item={item} />
            ))}
          </ul>
          <PeopleAlsoBought exclude={cart.filter((i) => i.type === 'product').map((i) => i._id)} />
        </div>
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <OrderSummary />
          <GiftCouponCard />
        </div>
      </div>
    </div>
  )
}
export default CartPage

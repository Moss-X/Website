import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../stores/useCartStore'
import { formatCurrency } from '../../utils/formatCurrency'
import Breadcrumbs from './Breadcrumbs'
import DetailImage from './DetailImage'
import ExpandableText from './ExpandableText'
import IncludedProducts from './IncludedProducts'

// Shared layout for bundles (discounted set) and collections (curated list at full price).
function GroupDetail({ item, type }) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [busy, setBusy] = useState(false)
  const isBundle = type === 'bundle'
  const price = isBundle ? item.discountedPrice : item.totalPrice
  const savings = isBundle ? Math.max(0, item.totalPrice - item.discountedPrice) : 0
  const percentOff = savings > 0 ? Math.round((savings / item.totalPrice) * 100) : 0

  async function add(thenCheckout) {
    setBusy(true)
    const ok = await addItem(item, type)
    setBusy(false)
    if (ok && thenCheckout) navigate('/cart')
  }

  return (
    <div className="container-page pt-6 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: isBundle ? 'Bundles' : 'Collections', to: isBundle ? '/#bundles' : '/#collections' },
          { label: item.title }
        ]}
      />
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <DetailImage src={item.image} alt={item.title} credit={item.imageCredit} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-sage px-3 py-1.5 text-[13px] font-bold">
                {isBundle ? 'Bundle' : 'Collection'} · {item.products.length} plants
              </span>
              {savings > 0 && (
                <span className="rounded-full bg-clay px-3 py-1.5 text-[13px] font-bold text-white">
                  Save {formatCurrency(savings)} ({percentOff}% off)
                </span>
              )}
            </div>
            <h1 className="heading-display text-[44px] leading-[1.05] sm:text-[56px]">{item.title}</h1>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[34px] font-semibold">{formatCurrency(price)}</span>
            {savings > 0 && <span className="text-xl text-muted line-through">{formatCurrency(item.totalPrice)}</span>}
          </div>
          <ExpandableText text={item.description} />

          <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-surface">
            {item.products.map((p) => (
              <li key={p._id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{p.name}</span>
                  {p.care?.level && (
                    <span className="text-sm text-muted">
                      {p.care.light} · {p.care.level} care
                    </span>
                  )}
                </span>
                <span className="text-muted tabular-nums">{formatCurrency(p.price)}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary h-[52px] flex-[1_1_220px]"
              disabled={busy}
              onClick={() => add(false)}
            >
              Add {isBundle ? 'bundle' : 'collection'} to cart
            </button>
            <button
              type="button"
              className="btn-outline h-[52px] flex-[1_1_140px]"
              disabled={busy}
              onClick={() => add(true)}
            >
              Buy now
            </button>
          </div>
          {!isBundle && (
            <p className="text-sm text-muted">
              Adds every plant in this collection. You can also add plants individually below.
            </p>
          )}
        </div>
      </div>

      <IncludedProducts
        title={isBundle ? "What's in the bundle" : 'Plants in this collection'}
        products={item.products}
      />
    </div>
  )
}

export default GroupDetail

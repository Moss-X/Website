import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useCartStore } from '../stores/useCartStore'
import { categoryByName } from '../lib/catalog'
import { formatCurrency } from '../utils/formatCurrency'
import Breadcrumbs from '../components/detail/Breadcrumbs'
import DetailImage from '../components/detail/DetailImage'
import DetailSkeleton from '../components/detail/DetailSkeleton'
import ExpandableText from '../components/detail/ExpandableText'
import QuantityPicker from '../components/detail/QuantityPicker'
import IncludedProducts from '../components/detail/IncludedProducts'
import NotFoundPage from './NotFoundPage'

const CARE_FIELDS = [
  { key: 'light', label: 'Light' },
  { key: 'water', label: 'Water' },
  { key: 'level', label: 'Care' }
]

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToCart = useCartStore((s) => s.addToCart)
  const [quantity, setQuantity] = useState(1)
  const [busy, setBusy] = useState(false)
  const { data: product, loading, error } = useFetch(`/products/${id}`)
  const category = product && categoryByName(product.category)
  const { data: related } = useFetch(category ? `/products/category/${category.slug}` : null)

  if (loading) return <DetailSkeleton />
  if (error || !product)
    return <NotFoundPage title="Plant not found" message="This plant may have been removed from the shop." />

  async function add(thenCheckout) {
    setBusy(true)
    const ok = await addToCart(product, quantity)
    setBusy(false)
    if (ok && thenCheckout) navigate('/cart')
  }

  const others = (related?.products || []).filter((p) => p._id !== product._id).slice(0, 4)

  return (
    <div className="container-page pt-6 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          category ? { label: category.name, to: `/category/${category.slug}` } : { label: 'Shop', to: '/search' },
          { label: product.name }
        ]}
      />
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <DetailImage src={product.image} alt={product.name} credit={product.imageCredit} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {product.isFeatured && (
              <span className="self-start rounded-full bg-sage px-3 py-1.5 text-[13px] font-bold">Best seller</span>
            )}
            <h1 className="heading-display text-[44px] leading-[1.05] sm:text-[56px]">{product.name}</h1>
            {product.botanicalName && <p className="text-lg text-muted italic">{product.botanicalName}</p>}
          </div>
          <p className="font-display text-[34px] font-semibold">{formatCurrency(product.price)}</p>
          <ExpandableText text={product.description} />

          {product.care && (
            <dl className="grid grid-cols-3 gap-3">
              {CARE_FIELDS.filter((f) => product.care[f.key]).map((f) => (
                <div key={f.key} className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-4">
                  <dt className="text-xs font-bold tracking-[0.08em] text-muted uppercase">{f.label}</dt>
                  <dd className="leading-snug font-medium">{product.care[f.key]}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <QuantityPicker value={quantity} onChange={(q) => setQuantity(Math.min(99, Math.max(1, q)))} />
            <button
              type="button"
              className="btn-primary h-[52px] flex-[1_1_180px]"
              disabled={busy}
              onClick={() => add(false)}
            >
              Add to cart · {formatCurrency(product.price * quantity)}
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
        </div>
      </div>

      {others.length > 0 && <IncludedProducts title={`More ${category.short.toLowerCase()}`} products={others} />}
    </div>
  )
}

export default ProductPage

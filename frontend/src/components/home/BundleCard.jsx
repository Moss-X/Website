import { Link } from 'react-router-dom'
import { useCartStore } from '../../stores/useCartStore'
import { cld } from '../../lib/image'
import { formatCurrency } from '../../utils/formatCurrency'

// `tone="dark"` is used on the dark bundles band on the home page.
function BundleCard({ bundle, tone = 'light' }) {
  const addBundleToCart = useCartStore((s) => s.addBundleToCart)
  const savings = Math.max(0, bundle.totalPrice - bundle.discountedPrice)
  const dark = tone === 'dark'
  const names = (bundle.products || []).map((p) => p.name).filter(Boolean)

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[26px] sm:flex-row ${dark ? 'bg-night text-ground' : 'border border-line bg-surface'}`}
    >
      <img
        src={cld(bundle.image, { w: 640, h: 640 })}
        alt=""
        loading="lazy"
        className="aspect-square w-full object-cover sm:aspect-auto sm:w-[46%]"
      />
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        <div className="flex flex-wrap gap-2">
          {savings > 0 && (
            <span className="rounded-full bg-clay px-3 py-1.5 text-xs font-bold text-white">
              Save {formatCurrency(savings)}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${dark ? 'bg-ink/60 text-sage' : 'bg-sage text-ink'}`}
          >
            {bundle.products?.length} plants
          </span>
        </div>
        <h3 className="heading-display text-[26px] leading-tight">
          <Link
            to={`/bundle/${bundle._id}`}
            className={`after:absolute after:inset-0 after:content-[''] ${dark ? 'text-ground hover:text-sage-strong' : 'text-ink hover:text-forest'}`}
          >
            {bundle.title}
          </Link>
        </h3>
        {names.length > 0 && (
          <p className={`text-[15px] leading-relaxed ${dark ? 'text-[#C9D3C4]' : 'text-muted'}`}>{names.join(' · ')}</p>
        )}
        <div className="mt-auto flex items-baseline gap-2.5 pt-2">
          <span className="font-display text-[26px] font-semibold">{formatCurrency(bundle.discountedPrice)}</span>
          {savings > 0 && (
            <span className={`line-through ${dark ? 'text-[#A3B09E]' : 'text-muted'}`}>
              {formatCurrency(bundle.totalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addBundleToCart(bundle)}
          className={`relative z-10 ${dark ? 'btn-light' : 'btn-primary'}`}
        >
          Add bundle to cart
        </button>
      </div>
    </article>
  )
}

export default BundleCard

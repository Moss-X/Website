import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'
import { cld } from '../lib/image'
import { formatCurrency } from '../utils/formatCurrency'

function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart)
  const [added, setAdded] = useState(false)

  async function handleAdd() {
    if (await addToCart(product)) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1400)
    }
  }

  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-[22px] bg-placeholder">
        <img
          src={cld(product.image, { w: 600, h: 750 })}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {product.care?.level && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink">
            {product.care.level} care
          </span>
        )}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute right-3 bottom-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-[background-color,transform] hover:scale-105 hover:bg-forest active:scale-95"
        >
          {added ? <Check className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="text-[15px] leading-snug font-bold sm:text-[17px]">
            <Link
              to={`/product/${product._id}`}
              className="text-ink after:absolute after:inset-0 after:rounded-[22px] after:content-[''] hover:text-forest"
            >
              {product.name}
            </Link>
          </h3>
          {product.botanicalName && <span className="truncate text-sm text-muted italic">{product.botanicalName}</span>}
        </div>
        <span className="font-display text-lg font-semibold whitespace-nowrap sm:text-xl">
          {formatCurrency(product.price)}
        </span>
      </div>
    </article>
  )
}

export default ProductCard

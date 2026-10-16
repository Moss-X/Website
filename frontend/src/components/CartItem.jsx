import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'
import { cld } from '../lib/image'
import { itemHref, itemTitle, unitPrice } from '../lib/catalog'
import { formatCurrency } from '../utils/formatCurrency'
import QuantityPicker from './detail/QuantityPicker'

const TYPE_LABEL = { bundle: 'Bundle', collection: 'Collection' }

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore()
  const title = itemTitle(item)
  const price = unitPrice(item)
  const included = (item.products || []).map((p) => p.name).filter(Boolean)

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link to={itemHref(item)} className="shrink-0">
        <img
          src={cld(item.image, { w: 240, h: 240 })}
          alt=""
          className="h-24 w-24 rounded-2xl bg-placeholder object-cover sm:h-32 sm:w-32"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {TYPE_LABEL[item.type] && (
              <span className="mb-1 inline-block rounded-full bg-sage px-2.5 py-0.5 text-xs font-bold">
                {TYPE_LABEL[item.type]}
              </span>
            )}
            <h3 className="text-[17px] leading-snug font-bold">
              <Link to={itemHref(item)} className="hover:text-forest">
                {title}
              </Link>
            </h3>
            {item.botanicalName && <p className="text-sm text-muted italic">{item.botanicalName}</p>}
            {included.length > 0 && <p className="line-clamp-2 text-sm text-muted">{included.join(' · ')}</p>}
          </div>
          <p className="font-display text-lg font-semibold whitespace-nowrap">
            {formatCurrency(price * item.quantity)}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantityPicker
            size="sm"
            min={0}
            label={`Quantity of ${title}`}
            value={item.quantity}
            onChange={(q) => updateQuantity(item._id, q, item.type)}
          />
          <div className="flex items-center gap-3">
            {item.quantity > 1 && <span className="text-sm text-muted">{formatCurrency(price)} each</span>}
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted hover:bg-sage hover:text-clay"
              onClick={() => removeFromCart(item._id, item.type)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CartItem

import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import { useCartStore } from '../stores/useCartStore'
import { Link, useNavigate } from 'react-router-dom'

function ProductCard({ product, variant = 'default' }) {
  const { user } = useUserStore()
  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  const savings = Math.max(0, product.totalPrice - product.discountedPrice)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
  }

  const handleBuyNow = (e) => {
    e.stopPropagation()
    addToCart(product)
    navigate('/cart')
  }

  return (
    <div
      className="bg-gray p-0 cursor-pointer  hover:scale-[1.01] transition transform flex flex-col aspect-4/5 drop-shadow-md hover:drop-shadow-xl "
      onClick={() => navigate(`/product/${product._id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View product ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/product/${product._id}`)
      }}
    >
      <div className="relative bg-gray flex items-center justify-center w-full h-[75%] aspect-square basis-1/2 md:basis-auto">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        {/* Conditional savings badge, similar to the bundle card */}
        {savings > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Save ₹{savings}
          </span>
        )}
      </div>
      <div className="flex flex-row p-4">
        <div className="flex-1 flex flex-col gap-1 ">
          <h3 className="text-xl md:text-2xl  text-black font-bold  line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-black font-semibold text-md md:text-xl">₹{product.price}</span>
            {/* Display discounted price if applicable */}
            {product.discountedPrice && (
              <span className="text-gray-400 line-through md:text-2xl">₹{product.totalPrice}</span>
            )}
          </div>
        </div>
        <div
          onClick={handleAddToCart}
          className="flex text-white aspect-square hover:ring-amber-400 rounded-full items-center just"
        >
          <Plus size={48} className="bg-black rounded-full p-2 hover:border-neutral border-4 border-gray" />
        </div>
      </div>
    </div>
  )
}

export default ProductCard

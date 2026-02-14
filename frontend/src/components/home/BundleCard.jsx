import { Plus } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useCartStore } from '../../stores/useCartStore'

function BundleCard({ bundle }) {
  // console.log("Length:", bundle.products);
  const { addBundleToCart } = useCartStore()
  const navigate = useNavigate()

  function handleAddToCart(e, bundle) {
    e.stopPropagation()
    addBundleToCart(bundle)
  }

  const savings = Math.max(0, bundle.totalPrice - bundle.discountedPrice)

  return (
    <div
      key={bundle._id}
      className="bg-gray p-0 cursor-pointer  hover:scale-[1.01] transition transform flex flex-col aspect-4/5 drop-shadow-sm hover:drop-shadow-lg"
      onClick={() => navigate(`/bundle/${bundle._id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View bundle ${bundle.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/bundle/${bundle._id}`)
      }}
    >
      <div className="relative bg-gray flex items-center justify-center w-full h-[75%] aspect-square basis-1/2 md:basis-auto">
        <img src={bundle.image} alt={bundle.title} className="w-full h-full object-contain " />
        <span className="absolute top-2 right-2 bg-primary rounded-full text-white text-xs font-semibold px-3 py-1  shadow-lg">
          {bundle.products.length} plants
        </span>
        {savings > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Save ₹{savings}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-1 p-5">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl md:text-2xl  text-black font-bold  line-clamp-1">{bundle.title}</h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-md md:text-xl  text-black font-semibold  line-clamp-1">
                ₹{bundle.discountedPrice}
              </span>
              <span className="text-gray-400 line-through text-md md:text-xl">₹{bundle.totalPrice}</span>
            </div>
          </div>
          <div
            onClick={handleAddToCart}
            className="flex text-white aspect-square hover:ring-amber-400 rounded-full items-center just"
          >
            <Plus size={48} className="bg-black rounded-full p-2 hover:border-neutral border-4 border-gray" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-darkGray ">
          {bundle.products.slice(0, 2).map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="flex items-center gap-1 bg-darkGray px-2 py-1 text-xs group "
              onClick={(e) => e.stopPropagation()}
              tabIndex={0}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-6 h-6 object-cover rounded-sm group-hover:ring-2 group-hover:ring-primary transition"
                />
              )}
              <span className="text-black max-w-20 truncate transition">{p.name}</span>
            </Link>
          ))}
          {bundle.products.length > 2 && (
            <span className="text-gray-400 text-xs">+{bundle.products.length - 2} more</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BundleCard

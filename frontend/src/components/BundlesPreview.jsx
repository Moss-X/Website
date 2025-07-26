import { useEffect, useState } from "react"
import { ShoppingCart, Zap } from "lucide-react"
import { useBundleStore } from "../stores/useBundleStore"
import { useNavigate, Link } from "react-router-dom"
import { useCartStore } from "../stores/useCartStore"

function BundlesPreview() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [showAll, setShowAll] = useState(false)
  const { bundles, fetchBundles, loading, error } = useBundleStore()
  const { addBundleToCart } = useCartStore()
  const navigate = useNavigate()
  // fetch bundles on mount
  useEffect(() => { fetchBundles() }, [fetchBundles])
  // determine initial visible count based on screen size and listen for resize
  useEffect(() => {
    function updateCount() {
      setVisibleCount(window.innerWidth < 768 ? 4 : 6)
    }
    updateCount()
    window.addEventListener('resize', updateCount)
    return () => window.removeEventListener('resize', updateCount)
  }, [])

  if (loading) return <div>Loading bundles...</div>
  if (error) return <div className="text-red-400">{error}</div>
  if (!bundles.length) return null

  function handleAddToCart(e, bundle) {
    e.stopPropagation()
    addBundleToCart(bundle)
  }
  function handleBuyNow(e, bundle) {
    e.stopPropagation()
    addBundleToCart(bundle)
    navigate("/cart")
  }

  return (
    <section className="my-16">
      <h2 className="text-4xl font-bold text-emerald-300 mb-2 text-left">Bundles</h2>
      <p className="text-left text-gray-400 mb-8 max-w-2xl ">
        Curated plant bundles for every home. Save more with our exclusive offers!
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {(showAll ? bundles : bundles.slice(0, visibleCount)).map(bundle => {
          const savings = Math.max(0, bundle.totalPrice - bundle.discountedPrice)
          return (
            <div
              key={bundle._id}
              className="bg-gray-800 rounded-lg p-0 shadow-lg cursor-pointer hover:ring-2 hover:ring-emerald-400 transition transform hover:scale-[1.025] flex flex-col aspect-[4/5]"
              onClick={() => navigate(`/bundle/${bundle._id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View bundle ${bundle.title}`}
              onKeyDown={e => { if (e.key === 'Enter') navigate(`/bundle/${bundle._id}`) }}
            >
              <div className="relative bg-gray-900  rounded-t-lg flex items-center justify-center w-full h-48 aspect-square basis-1/2 md:basis-auto">
                <img src={bundle.image} alt={bundle.title} className="w-full h-full object-contain rounded-t-lg" />
                <span className="absolute top-2 right-2 bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {bundle.products.length} plants
                </span>
                {savings > 0 && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Save ₹{savings}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col p-5">
                <h3 className="text-xl font-bold text-emerald-300 mb-1 line-clamp-1">{bundle.title}</h3>
                <div className="hidden md:block text-gray-200 mb-2 line-clamp-2 flex-1 max-h-[3.2em] overflow-hidden">{bundle.description}</div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-emerald-400 font-bold text-2xl md:text-3xl">₹{bundle.discountedPrice}</span>
                  <span className="text-gray-400 line-through text-lg">₹{bundle.totalPrice}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-700 ">
                  {bundle.products.slice(0, 4).map(p => (
                    <Link
                      key={p._id}
                      to={`/product/${p._id}`}
                      className="flex items-center gap-1 bg-gray-900 rounded px-2 py-1 text-xs group "
                      onClick={e => e.stopPropagation()}
                      tabIndex={0}
                    >
                      {p.image && <img src={p.image} alt={p.name} className="w-6 h-6 object-cover rounded group-hover:ring-2 group-hover:ring-emerald-400 transition" />}
                      <span className="text-gray-200 max-w-[5rem] truncate group-hover:text-emerald-400 transition">{p.name}</span>
                    </Link>
                  ))}
                  {bundle.products.length > 4 && (
                    <span className="text-gray-400 text-xs">+{bundle.products.length - 4} more</span>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors text-base"
                    onClick={e => handleAddToCart(e, bundle)}
                    tabIndex={0}
                  >
                    <ShoppingCart className="w-5 h-5 md:hidden" /><span className="hidden md:inline">Add to Cart</span>
                  </button>
                  <button
                    className="flex flex-row items-center gap-2 justify-center bg-white/10 hover:bg-white/20 text-emerald-400 font-semibold py-2 px-4 rounded transition-colors text-base md:w-1/2"
                    onClick={e => handleBuyNow(e, bundle)}
                    tabIndex={0}
                  >
                    <span className=" md:inline text-xs  md:text-base">Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {bundles.length > visibleCount && (
        <div className="text-center mt-8">
          <button
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded transition-colors"
            onClick={() => setShowAll(prev => !prev)}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </section>
  )
}

export default BundlesPreview 
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axios from "../lib/axios"
import { useCartStore } from "../stores/useCartStore"
import ProductCard from "../components/ProductCard"

function BundlePage() {
  const { id } = useParams()
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addBundleToCart } = useCartStore()
  const [showAll, setShowAll] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`/bundles/${id}`)
      .then(res => setBundle(res.data))
      .catch(() => setError("Bundle not found"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error || !bundle) return <div className="min-h-screen flex items-center justify-center text-red-400">{error || "Bundle not found"}</div>

  const discountRatio = bundle.discountedPrice / bundle.totalPrice
  const savings = Math.max(0, bundle.totalPrice - bundle.discountedPrice)
  const isBestValue = savings / bundle.totalPrice > 0.2
  const productsToShow = showAll ? bundle.products : bundle.products.slice(0, 4)
  const canExpand = bundle.products.length > 4

  return (
    <div className="min-h-screen pt-19">
      {/* Hero Banner */}
      <section className="relative w-full max-w-(--breakpoint-xl) mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="bg-gray rounded-xl flex items-center justify-center w-full aspect-square max-w-md mb-4 md:mb-0">
            <img src={bundle.image} alt={bundle.title} className="w-full h-full object-contain rounded-xl" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="flex gap-2 mb-2">
            {isBestValue && <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Best Value</span>}
            <span className="bg-secondary text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Save ₹{savings}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 text-center md:text-left">{bundle.title}</h1>
          <div className="mb-4 w-full">
            <p
              className={`text-lg text-black text-center md:text-left ${showFullDesc ? '' : 'line-clamp-3'}`}
            >
              {bundle.description}
            </p>
            {bundle.description.length > 120 && (
              <button
                className="text-primary hover:underline text-sm mt-2"
                onClick={() => setShowFullDesc(v => !v)}
              >
                {showFullDesc ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-black font-bold text-2xl">₹{bundle.discountedPrice}</span>
            <span className="text-gray-400 line-through text-2xl">₹{bundle.totalPrice}</span>
            <span className="text-primary text-lg">({Math.round((1 - discountRatio) * 100)}% off)</span>
          </div>
      {/* Sticky Action Bar (mobile/desktop) */}
        <div className="flex gap-4 py-4 px-4 md:p-0 justify-center md:justify-start w-full max-w-(--breakpoint-xl) mx-auto">
          <button
            className="px-6 py-3 flex bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition whitespace-nowrap font-semibold text-lg"
            onClick={() => addBundleToCart(bundle)}
          >
            Add Bundle to Cart
          </button>
          <button
            className="px-6 py-3 flex bg-secondary text-black rounded-full shadow-md hover:bg-gray-200 transition whitespace-nowrap font-semibold text-lg"
          >
            Buy Bundle
          </button>
        </div>
        </div>
      </section>

      {/* Included Plants */}
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2
          className="text-2xl font-bold text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Included Plants
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence initial={false}>
            {productsToShow.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
        {canExpand && (
          <div className="flex justify-center mt-6">
            <button
              className="text-primary hover:underline text-lg font-medium"
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? "Show Less" : `Show All (${bundle.products.length})`}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default BundlePage
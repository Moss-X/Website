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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <section className="relative w-full max-w-screen-xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="bg-gray-900 rounded-xl flex items-center justify-center w-full aspect-square max-w-md mb-4 md:mb-0">
            <img src={bundle.image} alt={bundle.title} className="w-full h-full object-contain rounded-xl" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="flex gap-2 mb-2">
            {isBestValue && <span className="bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">Best Value</span>}
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">Save ₹{savings}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2 text-center md:text-left">{bundle.title}</h1>
          <p className="text-lg text-gray-200 mb-4 text-center md:text-left">{bundle.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-emerald-400 font-bold text-3xl">₹{bundle.discountedPrice}</span>
            <span className="text-gray-400 line-through text-2xl">₹{bundle.totalPrice}</span>
            <span className="text-green-400 text-lg">({Math.round((1 - discountRatio) * 100)}% off)</span>
          </div>
        </div>
        {/* Sticky Action Bar (mobile/desktop) */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-gray-900/95 border-t border-emerald-800 flex justify-center md:static md:w-auto md:bg-transparent md:border-none md:justify-start md:mt-6">
          <div className="flex gap-4 py-4 px-4 md:p-0 w-full max-w-screen-xl mx-auto">
            <button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded transition-colors text-lg" onClick={() => addBundleToCart(bundle)}>
              Add Bundle to Cart
            </button>
            <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-emerald-400 font-semibold py-3 px-6 rounded transition-colors text-lg">
              Buy Bundle
            </button>
          </div>
        </div>
      </section>
      {/* Included Plants */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2
          className="text-2xl font-bold text-emerald-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Included Plants
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence initial={false}>
            {productsToShow.map(product => (
              <ProductCard key={product._id} product={product} variant="mini" />
            ))}
          </AnimatePresence>
        </motion.div>
        {canExpand && (
          <div className="flex justify-center mt-6">
            <button
              className="text-emerald-400 hover:underline text-lg font-medium"
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
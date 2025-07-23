import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "../lib/axios"
import { useCartStore } from "../stores/useCartStore"

function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToCart } = useCartStore()
  const navigate = useNavigate()
  const [showFullDesc, setShowFullDesc] = useState(false)
  // Placeholder for related products
  const [relatedProducts] = useState([])

  useEffect(() => {
    setLoading(true)
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    addToCart(product)
  }
  function handleBuyNow() {
    addToCart(product)
    navigate("/cart")
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-400">{error || "Product not found"}</div>

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <section className="relative w-full max-w-screen-lg mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="w-full md:w-2/3 flex flex-col items-center md:items-start">
          <img src={product.image} alt={product.name} className="w-full max-w-lg h-[28rem] object-cover rounded-xl shadow-2xl mb-4 md:mb-0" />
        </div>
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2 text-center md:text-left">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-emerald-400 font-bold text-2xl">₹{product.price}</span>
          </div>
          <div className="mb-4 w-full">
            <p className={`text-lg text-gray-200 text-center md:text-left ${showFullDesc ? '' : 'line-clamp-3'}`}>{product.description}</p>
            {product.description.length > 120 && (
              <button
                className="text-emerald-400 hover:underline text-sm mt-2"
                onClick={() => setShowFullDesc(v => !v)}
              >
                {showFullDesc ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
        {/* Sticky Action Bar (mobile/desktop) */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-gray-900/95 border-t border-emerald-800 flex justify-center md:static md:w-auto md:bg-transparent md:border-none md:justify-start md:mt-6">
          <div className="flex gap-4 py-4 px-4 md:p-0 w-full max-w-screen-lg mx-auto">
            <button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded transition-colors text-lg" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-emerald-400 font-semibold py-3 px-6 rounded transition-colors text-lg" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </section>
      {/* Reviews Section Placeholder */}
      <section className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.h2
          className="text-xl font-bold text-emerald-300 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Customer Reviews (coming soon)
        </motion.h2>
      </section>
      {/* Related Products Section (placeholder) */}
      {relatedProducts.length > 0 && (
        <section className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.h2
            className="text-xl font-bold text-emerald-300 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Related Products
          </motion.h2>
          {/* Render related products here */}
        </section>
      )}
    </div>
  )
}

export default ProductPage 
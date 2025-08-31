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
    <div className="min-h-screen pt-19">
      {/* Hero Banner */}
      <section className="relative w-full mx-auto max-w-(--breakpoint-xl) mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="bg-gray rounded-xl flex items-center justify-center w-full aspect-square max-w-md mb-4 md:mb-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-xl" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="flex gap-2 mb-2">
            {/* You can add badges here if needed */}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 text-center md:text-left">{product.name}</h1>
          <div className="mb-4 w-full">
            <p className={`text-lg text-black text-center md:text-left ${showFullDesc ? '' : 'line-clamp-3'}`}>{product.description}</p>
            {product.description.length > 120 && (
              <button
                className="text-primary hover:underline text-sm mt-2"
                onClick={() => setShowFullDesc(v => !v)}
              >
                {showFullDesc ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-black font-bold text-2xl">₹{product.price}</span>
            {/* If you want to show a discount, add it here */}
          </div>
          {/* Sticky Action Bar (mobile/desktop) */}
          <div className="flex gap-4 py-4 px-4 md:p-0 justify-center md:justify-start w-full max-w-(--breakpoint-xl) mx-auto">
            <button className="px-6 py-3 flex bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition whitespace-nowrap font-semibold text-lg" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="px-6 py-3 flex bg-secondary text-black rounded-full shadow-md hover:bg-gray-200 transition whitespace-nowrap font-semibold text-lg" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </section>
      {/* Reviews Section Placeholder */}
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.h2
          className="text-2xl font-bold text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Customer Reviews (coming soon)
        </motion.h2>
      </section>
      {/* Related Products Section (placeholder) */}
      {relatedProducts.length > 0 && (
        <section className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.h2
            className="text-2xl font-bold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
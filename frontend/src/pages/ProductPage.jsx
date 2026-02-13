import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import { useCartStore } from '../stores/useCartStore'
import ProductImage from '../components/product/ProductImage'
import ProductDetails from '../components/product/ProductDetails'
import ProductActions from '../components/product/ProductActions'
import ProductReviews from '../components/product/ProductReviews'

function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    addToCart(product)
  }
  function handleBuyNow() {
    addToCart(product)
    navigate('/cart')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">{error || 'Product not found'}</div>
    )

  return (
    <div className="min-h-screen pt-19">
      <section className="relative w-full max-w-(--breakpoint-xl) mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <ProductImage image={product.image} name={product.name} />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <ProductDetails name={product.name} description={product.description} price={product.price} />
          <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
        </div>
      </section>
      <ProductReviews />
    </div>
  )
}

export default ProductPage

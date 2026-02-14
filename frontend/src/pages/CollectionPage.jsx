import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import { useCartStore } from '../stores/useCartStore'
import CollectionHero from '../components/collection/CollectionHero'
import CollectionProducts from '../components/collection/CollectionProducts'

function CollectionPage() {
  const { id } = useParams()
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const { addCollectionToCart } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/collections/${id}`)
      .then((res) => setCollection(res.data))
      .catch(() => setError('Collection not found'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    addCollectionToCart(collection)
  }
  function handleBuyNow() {
    addCollectionToCart(collection)
    navigate('/cart')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error || !collection)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || 'Collection not found'}
      </div>
    )

  // Discount logic
  const discountRatio =
    collection.discountedPrice && collection.totalPrice ? collection.discountedPrice / collection.totalPrice : 1
  const savings =
    collection.discountedPrice && collection.totalPrice
      ? Math.max(0, collection.totalPrice - collection.discountedPrice)
      : 0
  const isBestValue = savings / (collection.totalPrice || 1) > 0.2

  const productsToShow = showAll ? collection.products : collection.products.slice(0, 4)
  const canExpand = collection.products.length > 4

  return (
    <div className="min-h-screen pt-19">
      <CollectionHero
        collection={collection}
        isBestValue={isBestValue}
        savings={savings}
        discountRatio={discountRatio}
        showFullDesc={showFullDesc}
        setShowFullDesc={setShowFullDesc}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />

      <CollectionProducts
        productsToShow={productsToShow}
        canExpand={canExpand}
        showAll={showAll}
        setShowAll={setShowAll}
        totalProducts={collection.products.length}
      />
    </div>
  )
}

export default CollectionPage

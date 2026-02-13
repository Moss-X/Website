import { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'
import FeaturedProducts from '../components/home/FeaturedProducts'
import HeroCarousel from '../components/home/HeroCarousel'
import BundlesPreview from '../components/home/BundlesPreview'
import CollectionsPreview from '../components/home/CollectionsPreview'

function HomePage() {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  return (
    <div className="relative min-h-screen text-textGreen overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {!isLoading && products.length > 0 && (
          <div>
            <HeroCarousel featuredProducts={products} />
          </div>
        )}
        <section id="best-seller-section">
          {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
        </section>
        <BundlesPreview />
        <CollectionsPreview />
      </div>
    </div>
  )
}
export default HomePage

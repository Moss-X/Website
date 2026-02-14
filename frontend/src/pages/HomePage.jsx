import { useEffect, useRef } from 'react'
import { useProductStore } from '../stores/useProductStore'
import FeaturedProducts from '../components/home/FeaturedProducts'
import HeroCarousel from '../components/home/HeroCarousel'
import BundlesPreview from '../components/home/BundlesPreview'
import CollectionsPreview from '../components/home/CollectionsPreview'
import { motion, useScroll, useSpring } from 'framer-motion'

function HomePage() {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore()
  const containerRef = useRef(null)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll({
    container: containerRef
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-y-auto snap-y snap-proximity scroll-smooth no-scrollbar"
    >
      {/* Top Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-100 origin-left" style={{ scaleX }} />

      {/* Hero Section */}
      <section className="snap-start w-full min-h-screen">
        {!isLoading && products.length > 0 && <HeroCarousel featuredProducts={products} />}
      </section>

      {/* Best Sellers */}
      <section
        id="best-seller-section"
        className="snap-start w-full min-h-screen flex items-center justify-center py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
        </div>
      </section>

      {/* Bundles */}
      <div className="snap-start w-full">
        <BundlesPreview />
      </div>

      {/* Collections */}
      <div className="snap-start w-full">
        <CollectionsPreview />
      </div>
    </div>
  )
}
export default HomePage

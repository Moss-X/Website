import { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'
import Hero from '../components/home/Hero'
import CategoryStrip from '../components/home/CategoryStrip'
import FeaturedProducts from '../components/home/FeaturedProducts'
import BundlesPreview from '../components/home/BundlesPreview'
import CollectionsPreview from '../components/home/CollectionsPreview'
import Promises from '../components/home/Promises'

function HomePage() {
  const { fetchFeaturedProducts, featured, featuredLoading } = useProductStore()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  return (
    <>
      <Hero highlights={featured} />
      <CategoryStrip />
      <FeaturedProducts products={featured} loading={featuredLoading && !featured.length} />
      <BundlesPreview />
      <CollectionsPreview />
      <Promises />
    </>
  )
}

export default HomePage

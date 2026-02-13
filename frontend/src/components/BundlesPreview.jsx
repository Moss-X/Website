import { useEffect, useState } from 'react'
import BundleCard from './BundleCard'
import { useBundleStore } from '../stores/useBundleStore'
import { useNavigate, Link } from 'react-router-dom'

function BundlesPreview() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [showAll, setShowAll] = useState(false)
  const { bundles, fetchBundles, loading, error } = useBundleStore()
  // fetch bundles on mount
  useEffect(() => {
    fetchBundles()
  }, [fetchBundles])
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

  return (
    <section className=" my-16 ">
      <h2 className="text-5xl font-bold text-black mb-2 text-left">Bundles</h2>
      <p className="text-left text-black mb-8 max-w-2xl ">
        Curated plant bundles for every home. Save more with our exclusive offers!
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {(showAll ? bundles : bundles.slice(0, visibleCount)).map((bundle) => (
          <BundleCard bundle={bundle} key={bundle._id} />
        ))}
      </div>
      {bundles.length > visibleCount && (
        <div className="text-center mt-8">
          <button
            className="mt-6 z-10 px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transitionx"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </section>
  )
}

export default BundlesPreview

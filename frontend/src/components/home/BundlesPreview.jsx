import { useEffect, useState } from 'react'
import BundleCard from './BundleCard'
import { useBundleStore } from '../../stores/useBundleStore'
import { motion } from 'framer-motion'

function BundlesPreview() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [showAll, setShowAll] = useState(false)
  const { bundles, fetchBundles, loading, error } = useBundleStore()

  useEffect(() => {
    fetchBundles()
  }, [fetchBundles])

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
    <section className="relative mt-16 py-12 overflow-hidden w-full ">
      {/* Top Shadow Overlay */}
      <div className="absolute top-0 left-0 w-full h-4 bg-linear-to-b from-black/8 to-transparent z-1 pointer-events-none" />

      <motion.div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none "
        initial={{ scale: 1.05 }}
        animate={{
          x: [0, -10, 0, 10, 0],
          y: [0, 10, 0, -10, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          backgroundImage: 'url("/leaf-pattern.avif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-5xl font-bold text-black mb-2 text-left ">Bundles</h2>
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
              className="mt-6 z-10 px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition whitespace-nowrap font-semibold"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default BundlesPreview

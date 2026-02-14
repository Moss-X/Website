import { useEffect, useState, useRef } from 'react'
import BundleCard from './BundleCard'
import { useBundleStore } from '../../stores/useBundleStore'
import { motion, useScroll, useTransform } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.1,
      when: 'beforeChildren'
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

function BundlesPreview() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [showAll, setShowAll] = useState(false)
  const { bundles, fetchBundles, loading, error } = useBundleStore()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

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

  if (loading) return <div className="text-center py-20 text-primary">Loading bundles...</div>
  if (error) return <div className="text-red-400 text-center py-20">{error}</div>
  if (!bundles.length) return null

  return (
    <section ref={sectionRef} className="relative mt-16 py-12 overflow-hidden w-full ">
      {/* Top Shadow Overlay */}
      <div className="absolute top-0 left-0 w-full h-4 bg-linear-to-b from-black/8 to-transparent z-1 pointer-events-none" />

      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none scale-125"
        style={{
          backgroundImage: 'url("/leaf-pattern.avif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-5xl font-bold text-black mb-2 text-left">
          Bundles
        </motion.h2>
        <motion.p variants={itemVariants} className="text-left text-black mb-8 max-w-2xl">
          Curated plant bundles for every home. Save more with our exclusive offers!
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {(showAll ? bundles : bundles.slice(0, visibleCount)).map((bundle) => (
            <motion.div key={bundle._id} variants={itemVariants}>
              <BundleCard bundle={bundle} />
            </motion.div>
          ))}
        </div>

        {bundles.length > visibleCount && (
          <motion.div variants={itemVariants} className="text-center mt-8">
            <button
              className="mt-6 z-10 px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition whitespace-nowrap font-semibold"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default BundlesPreview

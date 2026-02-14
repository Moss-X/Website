import { useEffect, useState, useRef } from 'react'
import { useCollectionStore } from '../../stores/useCollectionStore'
import CollectionCard from './CollectionCard'
import { motion, useScroll, useTransform } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.2,
      when: 'beforeChildren'
    }
  }
}

const itemVariants = {
  hidden: (index) => ({
    opacity: 0,
    x: index % 2 === 0 ? -30 : 30
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
}

function CollectionsPreview() {
  const [visibleCount, setVisibleCount] = useState(6)
  const { collections, fetchCollections, error } = useCollectionStore()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  useEffect(() => {
    function updateCount() {
      setVisibleCount(window.innerWidth < 768 ? 4 : 6)
    }
    updateCount()
    window.addEventListener('resize', updateCount)
    return () => window.removeEventListener('resize', updateCount)
  }, [])

  if (error) return <div className="text-red-400 text-center py-20">{error}</div>
  if (!collections.length) return null

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-20 bg-secondary/40">
      {/* Top Shadow Overlay */}
      <div className="absolute top-0 left-0 w-full h-6 bg-linear-to-b from-black/10 to-transparent z-1 pointer-events-none" />

      {/* Bottom Shadow Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/10 to-transparent z-1 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16 my-16"
      >
        {collections.slice(0, visibleCount).map((collection, index) => (
          <motion.div key={collection._id || index} custom={index} variants={itemVariants}>
            <CollectionCard collection={collection} odd={index % 2 !== 0} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default CollectionsPreview

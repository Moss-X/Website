import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../ProductCard'

const CollectionProducts = ({ productsToShow, canExpand, showAll, setShowAll, totalProducts }) => {
  return (
    <section className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <motion.h2
        className="text-2xl font-bold text-primary mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Included Products
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AnimatePresence initial={false}>
          {productsToShow.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>
      {canExpand && (
        <div className="flex justify-center mt-6">
          <button className="text-primary hover:underline text-lg font-medium" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show Less' : `Show All (${totalProducts})`}
          </button>
        </div>
      )}
    </section>
  )
}

export default CollectionProducts

import React from 'react'
import { motion } from 'framer-motion'

function ProductReviews() {
  return (
    <section className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <motion.h2
        className="text-2xl font-bold text-primary mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Customer Reviews (coming soon)
      </motion.h2>
    </section>
  )
}

export default ProductReviews

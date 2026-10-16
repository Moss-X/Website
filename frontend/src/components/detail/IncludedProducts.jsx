import { useState } from 'react'
import ProductCard from '../ProductCard'

function IncludedProducts({ title, products }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? products : products.slice(0, 8)
  return (
    <section aria-labelledby="included-heading" className="pt-20">
      <h2 id="included-heading" className="heading-display mb-6 text-[32px] sm:text-[36px]">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {products.length > 8 && (
        <div className="mt-8 text-center">
          <button type="button" className="btn-outline" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show less' : `Show all ${products.length}`}
          </button>
        </div>
      )}
    </section>
  )
}

export default IncludedProducts

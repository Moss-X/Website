import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard'
import ProductGridSkeleton from '../ProductGridSkeleton'

const FeaturedProducts = ({ products, loading }) => {
  if (!loading && products.length === 0) return null

  return (
    <section id="best-sellers" aria-labelledby="best-sellers-heading" className="container-page scroll-mt-24 pb-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 id="best-sellers-heading" className="heading-display text-[40px] sm:text-[44px]">
          Best sellers
        </h2>
        <Link to="/search" className="font-bold text-moss hover:text-forest">
          View all plants <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          products.slice(0, 8).map((product) => <ProductCard key={product._id} product={product} />)
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts

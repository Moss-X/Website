import ProductCard from '../ProductCard'
import BundleCard from '../home/BundleCard'

const ResultsGrid = ({ products, bundles, collections, loading, error, query, handleBundleClick }) => {
  if (loading) return <div className="text-black">Loading...</div>
  if (error) return <div className="text-red-400">{error}</div>

  const noResults = products.length === 0 && bundles.length === 0 && collections.length === 0

  return (
    <div className="p-4 flex-1">
      <h1 className="text-3xl font-bold text-primary mb-6">{`Search Results for "${query}"`}</h1>

      {noResults && <div className="text-black">No results found.</div>}

      {products.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-primary mb-4 mt-8">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}

      {bundles.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-primary mb-4 mt-8">Bundles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
            {bundles.map((bundle) => (
              <BundleCard key={bundle._id} bundle={bundle} onClick={() => handleBundleClick(bundle._id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ResultsGrid

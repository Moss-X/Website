import ProductCard from '../ProductCard'
import ProductGridSkeleton from '../ProductGridSkeleton'
import BundleCard from '../home/BundleCard'
import CollectionCard from '../home/CollectionCard'

const ResultsGrid = ({ products, bundles, collections, loading, error }) => {
  if (error) return <p className="py-16 text-center text-lg text-clay">{error}</p>
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3">
        <ProductGridSkeleton count={6} />
      </div>
    )

  if (!products.length && !bundles.length && !collections.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
        <p className="heading-display text-2xl">No plants match that search</p>
        <p className="max-w-sm text-muted">Try a different name, remove a filter, or browse a category instead.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-14">
      {products.length > 0 && (
        <section aria-labelledby="res-plants">
          <h2 id="res-plants" className="eyebrow mb-5">
            Plants · {products.length}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
      {bundles.length > 0 && (
        <section aria-labelledby="res-bundles">
          <h2 id="res-bundles" className="eyebrow mb-5">
            Bundles · {bundles.length}
          </h2>
          <div className="grid gap-6 xl:grid-cols-2">
            {bundles.map((bundle) => (
              <BundleCard key={bundle._id} bundle={bundle} />
            ))}
          </div>
        </section>
      )}
      {collections.length > 0 && (
        <section aria-labelledby="res-collections">
          <h2 id="res-collections" className="eyebrow mb-5">
            Collections · {collections.length}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {collections.map((c) => (
              <CollectionCard key={c._id} collection={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ResultsGrid

import { useEffect, useState } from 'react'
import BundleCard from './BundleCard'
import { useBundleStore } from '../../stores/useBundleStore'

function BundlesPreview() {
  const { bundles, fetchBundles, loading } = useBundleStore()
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchBundles()
  }, [fetchBundles])

  if (!loading && !bundles.length) return null
  const visible = showAll ? bundles : bundles.slice(0, 4)

  return (
    <section id="bundles" aria-labelledby="bundles-heading" className="scroll-mt-20 bg-ink text-ground">
      <div className="container-page py-20 sm:py-24">
        <div className="mb-10 flex max-w-[38em] flex-col gap-3">
          <h2 id="bundles-heading" className="heading-display text-[40px] sm:text-[44px]">
            Bundles that grow together
          </h2>
          <p className="text-[17px] leading-relaxed text-[#C9D3C4]">
            Plants chosen to share the same light and water, priced lower than buying them one by one.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {loading && !bundles.length
            ? [0, 1].map((i) => <div key={i} className="h-[340px] animate-pulse rounded-[26px] bg-night" />)
            : visible.map((bundle) => <BundleCard key={bundle._id} bundle={bundle} tone="dark" />)}
        </div>
        {bundles.length > 4 && (
          <div className="mt-10 text-center">
            <button type="button" className="btn-light" onClick={() => setShowAll((v) => !v)}>
              {showAll ? 'Show fewer bundles' : `Show all ${bundles.length} bundles`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default BundlesPreview

import { useEffect } from 'react'
import { useCollectionStore } from '../../stores/useCollectionStore'
import CollectionCard from './CollectionCard'

function CollectionsPreview() {
  const { collections, fetchCollections, loading } = useCollectionStore()

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  if (!loading && !collections.length) return null

  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="container-page scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mb-10 flex max-w-[38em] flex-col gap-3">
        <h2 id="collections-heading" className="heading-display text-[40px] sm:text-[44px]">
          Collections
        </h2>
        <p className="text-[17px] leading-relaxed text-muted">
          Hand-picked edits for the spaces and lifestyles we hear about most.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {loading && !collections.length
          ? [0, 1].map((i) => <div key={i} className="h-[420px] animate-pulse rounded-[26px] bg-placeholder" />)
          : collections.map((collection) => <CollectionCard key={collection._id} collection={collection} />)}
      </div>
    </section>
  )
}

export default CollectionsPreview

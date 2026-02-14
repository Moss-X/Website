import { useEffect, useState } from 'react'
import { useCollectionStore } from '../../stores/useCollectionStore'
import CollectionCard from './CollectionCard'

function CollectionsPreview() {
  const [visibleCount, setVisibleCount] = useState(6)
  const { collections, fetchCollections, error } = useCollectionStore()

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

  if (error) return <div className="text-red-400">{error}</div>
  if (!collections.length) return null

  return (
    <section className="relative w-full overflow-hidden  py-20 bg-secondary/40">
      {/* Top Shadow Overlay */}
      <div className="absolute top-0 left-0 w-full h-4 bg-linear-to-b from-black/8 to-transparent z-1 pointer-events-none" />

      {/* Bottom Shadow Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/10 to-transparent z-1 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16 my-16">
        {collections.slice(0, visibleCount).map((collection, index) => (
          <CollectionCard key={collection._id || index} collection={collection} odd={index % 2 !== 0} />
        ))}
      </div>
    </section>
  )
}

export default CollectionsPreview

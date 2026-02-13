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
    <section className="flex flex-col gap-8 my-16 ">
      {collections.slice(0, visibleCount).map((collection, index) => (
        <CollectionCard key={collection._id || index} collection={collection} odd={index % 2 !== 0} />
      ))}
    </section>
  )
}

export default CollectionsPreview

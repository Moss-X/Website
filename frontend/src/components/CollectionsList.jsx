import { useEffect } from 'react'
import { useCollectionStore } from '../stores/useCollectionStore'
import { formatCurrency } from '../utils/formatCurrency'

function CollectionsList() {
  const { collections, fetchCollections, deleteCollection, loading, error } = useCollectionStore()
  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  if (loading) return <div>Loading collections...</div>
  if (error) return <div className="text-clay">{error}</div>
  if (!collections.length) return <div>No collections found.</div>

  return (
    <div className="space-y-6">
      {collections.map((collection) => (
        <div key={collection._id} className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={collection.image} alt={collection.title} className="w-20 h-20 object-cover rounded-xl" />
              <h3 className="text-xl font-bold text-moss">{collection.title}</h3>
            </div>
            <button
              onClick={() => window.confirm(`Delete "${collection.title}"?`) && deleteCollection(collection._id)}
              className="text-clay hover:text-ink text-sm border border-clay rounded-xl px-2 py-1 ml-4"
            >
              Delete
            </button>
          </div>
          <div className="text-ink mb-1">{collection.description}</div>
          <div className="text-moss font-semibold mb-1">Total price: {formatCurrency(collection.totalPrice)}</div>
          <div className="text-muted text-sm">
            Includes:
            <ul className="list-disc ml-6">
              {collection.products.map((p) => (
                <li key={p._id}>{p.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CollectionsList

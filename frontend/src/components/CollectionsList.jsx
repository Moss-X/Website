import { useEffect } from "react"
import { useCollectionStore } from "../stores/useCollectionStore"

function CollectionsList() {
  const { collections, fetchCollections, deleteCollection, loading, error } = useCollectionStore()
  useEffect(() => { fetchCollections() }, [fetchCollections])

  if (loading) return <div>Loading collections...</div>
  if (error) return <div className="text-red-400">{error}</div>
  if (!collections.length) return <div>No collections found.</div>

  return (
    <div className="space-y-6">
      {collections.map(collection => (
        <div key={collection._id} className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={collection.image} alt={collection.title} className="w-20 h-20 object-cover rounded-sm" />
              <h3 className="text-xl font-bold text-emerald-300">{collection.title}</h3>
            </div>
            <button
              onClick={() => deleteCollection(collection._id)}
              className="text-red-400 hover:text-red-300 text-sm border border-red-400 rounded-sm px-2 py-1 ml-4"
            >
              Delete
            </button>
          </div>
          <div className="text-gray-200 mb-1">{collection.description}</div>
          <div className="text-emerald-400 font-semibold mb-1">Total Price: ₹{collection.totalPrice}</div>
          <div className="text-gray-400 text-sm">Includes:
            <ul className="list-disc ml-6">
              {collection.products.map(p => (
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
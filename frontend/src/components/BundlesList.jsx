import { useEffect } from "react"
import { useBundleStore } from "../stores/useBundleStore"

function BundlesList() {
  const { bundles, fetchBundles, deleteBundle, loading, error } = useBundleStore()
  useEffect(() => { fetchBundles() }, [fetchBundles])

  if (loading) return <div>Loading bundles...</div>
  if (error) return <div className="text-red-400">{error}</div>
  if (!bundles.length) return <div>No bundles found.</div>

  return (
    <div className="space-y-6">
      {bundles.map(bundle => (
        <div key={bundle._id} className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-emerald-300">{bundle.title}</h3>
            <button
              onClick={() => deleteBundle(bundle._id)}
              className="text-red-400 hover:text-red-300 text-sm border border-red-400 rounded-sm px-2 py-1 ml-4"
            >
              Delete
            </button>
          </div>
          <div className="text-gray-200 mb-1">{bundle.description}</div>
          <div className="text-emerald-400 font-semibold mb-1">Discounted Price: ${bundle.discountedPrice}</div>
          <div className="text-gray-400 text-sm">Includes:
            <ul className="list-disc ml-6">
              {bundle.products.map(p => (
                <li key={p._id}>{p.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BundlesList 
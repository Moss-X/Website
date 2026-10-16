import { useEffect } from 'react'
import { useBundleStore } from '../stores/useBundleStore'
import { formatCurrency } from '../utils/formatCurrency'

function BundlesList() {
  const { bundles, fetchBundles, deleteBundle, loading, error } = useBundleStore()
  useEffect(() => {
    fetchBundles()
  }, [fetchBundles])

  if (loading) return <div>Loading bundles...</div>
  if (error) return <div className="text-clay">{error}</div>
  if (!bundles.length) return <div>No bundles found.</div>

  return (
    <div className="space-y-6">
      {bundles.map((bundle) => (
        <div key={bundle._id} className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-2">
          <img src={bundle.image} alt="" className="w-20 h-20 object-cover rounded-xl" />
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-moss">{bundle.title}</h3>
            <button
              onClick={() => window.confirm(`Delete "${bundle.title}"?`) && deleteBundle(bundle._id)}
              className="text-clay hover:text-ink text-sm border border-clay rounded-xl px-2 py-1 ml-4"
            >
              Delete
            </button>
          </div>
          <div className="text-ink mb-1">{bundle.description}</div>
          <div className="text-moss font-semibold mb-1">
            Price: {formatCurrency(bundle.discountedPrice)} (was {formatCurrency(bundle.totalPrice)})
          </div>
          <div className="text-muted text-sm">
            Includes:
            <ul className="list-disc ml-6">
              {bundle.products.map((p) => (
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

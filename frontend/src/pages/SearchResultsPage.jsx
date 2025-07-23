import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../lib/axios"
import ProductCard from "../components/ProductCard"
import { Tag, DollarSign, X } from "lucide-react"

const productCategories = [
  "Ornamental Houseplants",
  "Flowering Bedding Plants",
  "Herbs and Edible Plants",
  "Succulents and Cacti",
  "Fruit Trees and Bushes",
  "Vegetable Plants and Seedlings",
  "Indoor Air-Purifying Plants"
]

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchResultsPage() {
  const queryParams = useQuery()
  const query = queryParams.get("q") || ""
  const [products, setProducts] = useState([])
  const [bundles, setBundles] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Filter state
  const [category, setCategory] = useState(queryParams.get("category") || "")
  const [minPrice, setMinPrice] = useState(queryParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(queryParams.get("maxPrice") || "")

  // Update URL when filters change
  function applyFilters(e) {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    navigate(`/search?${params.toString()}`)
  }
  function resetFilters() {
    setCategory("")
    setMinPrice("")
    setMaxPrice("")
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    navigate(`/search?${params.toString()}`)
  }
  function removeFilter(type) {
    if (type === "category") setCategory("")
    if (type === "minPrice") setMinPrice("")
    if (type === "maxPrice") setMaxPrice("")
    setTimeout(applyFilters, 0)
  }

  useEffect(() => {
    setLoading(true)
    setError("")
    Promise.all([
      axios.get(`/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&minPrice=${minPrice}&maxPrice=${maxPrice}`),
      axios.get(`/bundles/search?q=${encodeURIComponent(query)}&minPrice=${minPrice}&maxPrice=${maxPrice}`),
      axios.get(`/collections/search?q=${encodeURIComponent(query)}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
    ])
      .then(([productsRes, bundlesRes, collectionsRes]) => {
        setProducts(productsRes.data)
        setBundles(bundlesRes.data)
        setCollections(collectionsRes.data)
      })
      .catch(() => setError("Failed to fetch search results"))
      .finally(() => setLoading(false))
    // eslint-disable-next-line
  }, [query, category, minPrice, maxPrice])

  function handleBundleClick(id) {
    navigate(`/bundle/${id}`)
  }
  function handleCollectionClick(id) {
    navigate(`/collection/${id}`)
  }

  // Active filter chips
  const activeFilters = []
  if (category) activeFilters.push({ label: category, type: "category" })
  if (minPrice) activeFilters.push({ label: `Min ₹${minPrice}`, type: "minPrice" })
  if (maxPrice) activeFilters.push({ label: `Max ₹${maxPrice}`, type: "maxPrice" })

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-6">Search Results for "{query}"</h1>
        {/* Filter Bar */}
        <form onSubmit={applyFilters} className="sticky top-20 z-30 bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-4 flex flex-col sm:flex-row flex-wrap gap-4 items-end mb-8">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tag className="w-4 h-4 text-gray-400" />
            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="">All</option>
              {productCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <label className="block text-xs font-medium text-gray-400 mb-1">Min Price</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-2 w-24"
              placeholder="₹"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <label className="block text-xs font-medium text-gray-400 mb-1">Max Price</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-2 w-24"
              placeholder="₹"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            {loading ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Loading...</span> : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold px-4 py-2 rounded transition-colors"
          >
            Reset
          </button>
        </form>
        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <span key={f.type} className="flex items-center bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                {f.label}
                <button onClick={() => removeFilter(f.type)} className="ml-2 hover:text-red-300" aria-label={`Remove ${f.label}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {loading && <div className="text-gray-400">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && products.length === 0 && bundles.length === 0 && collections.length === 0 && (
          <div className="text-gray-400">No results found.</div>
        )}
        {products.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-emerald-300 mb-4 mt-8">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
        {bundles.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-emerald-300 mb-4 mt-8">Bundles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
              {bundles.map(bundle => (
                <div
                  key={bundle._id}
                  className="bg-gray-800 rounded-lg p-0 shadow-lg cursor-pointer hover:ring-2 hover:ring-emerald-400 transition transform hover:scale-[1.025] flex flex-col aspect-[4/5]"
                  onClick={() => handleBundleClick(bundle._id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View bundle ${bundle.title}`}
                  onKeyDown={e => { if (e.key === 'Enter') handleBundleClick(bundle._id) }}
                >
                  <div className="relative bg-gray-900 rounded-t-lg flex items-center justify-center w-full aspect-square max-h-[50%]">
                    <img src={bundle.image} alt={bundle.title} className="w-full h-full object-contain rounded-t-lg" />
                    <span className="absolute top-2 right-2 bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      {bundle.products.length} plants
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-5">
                    <h3 className="text-xl font-bold text-emerald-300 mb-1 line-clamp-1">{bundle.title}</h3>
                    <div className="text-gray-200 mb-2 line-clamp-2 flex-1 max-h-[3.2em] overflow-hidden">{bundle.description}</div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-emerald-400 font-bold text-2xl md:text-3xl">₹{bundle.discountedPrice}</span>
                      <span className="text-gray-400 line-through text-lg">₹{bundle.totalPrice}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-700">
                      {bundle.products.slice(0, 4).map(p => (
                        <span key={p._id} className="flex items-center gap-1 bg-gray-900 rounded px-2 py-1 text-xs">
                          {p.image && <img src={p.image} alt={p.name} className="w-6 h-6 object-cover rounded" />}
                          <span className="text-gray-200 max-w-[5rem] truncate">{p.name}</span>
                        </span>
                      ))}
                      {bundle.products.length > 4 && (
                        <span className="text-gray-400 text-xs">+{bundle.products.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {collections.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-emerald-300 mb-4 mt-8">Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
              {collections.map(collection => (
                <div
                  key={collection._id}
                  className="bg-gray-800 rounded-lg p-0 shadow-lg cursor-pointer hover:ring-2 hover:ring-emerald-400 transition transform hover:scale-[1.025] flex flex-col aspect-[4/5]"
                  onClick={() => handleCollectionClick(collection._id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View collection ${collection.title}`}
                  onKeyDown={e => { if (e.key === 'Enter') handleCollectionClick(collection._id) }}
                >
                  <div className="relative bg-gray-900 rounded-t-lg flex items-center justify-center w-full aspect-square max-h-[50%]">
                    <img src={collection.image} alt={collection.title} className="w-full h-full object-contain rounded-t-lg" />
                    <span className="absolute top-2 right-2 bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      {collection.products.length} products
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-5">
                    <h3 className="text-xl font-bold text-emerald-300 mb-1 line-clamp-1">{collection.title}</h3>
                    <div className="text-gray-200 mb-2 line-clamp-2 flex-1 max-h-[3.2em] overflow-hidden">{collection.description}</div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-emerald-400 font-bold text-2xl md:text-3xl">₹{collection.totalPrice}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-700">
                      {collection.products.slice(0, 4).map(p => (
                        <span key={p._id} className="flex items-center gap-1 bg-gray-900 rounded px-2 py-1 text-xs">
                          {p.image && <img src={p.image} alt={p.name} className="w-6 h-6 object-cover rounded" />}
                          <span className="text-gray-200 max-w-[5rem] truncate">{p.name}</span>
                        </span>
                      ))}
                      {collection.products.length > 4 && (
                        <span className="text-gray-400 text-xs">+{collection.products.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage 
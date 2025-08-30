import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../lib/axios"
import ProductCard from "../components/ProductCard"
import { Tag, X, IndianRupee } from "lucide-react"
import BundleCard from "../components/BundleCard"

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
  const [category, setCategory] = useState(() => {
    const cat = queryParams.get("category")
    if (!cat) return [];
    return cat.split(",");
  });
  const SLIDER_MIN = 0;
  const SLIDER_MAX = 10000;
  const SLIDER_STEP = 100;
  const [minPrice, setMinPrice] = useState(Number(queryParams.get("minPrice")) || SLIDER_MIN);
  const [maxPrice, setMaxPrice] = useState(Number(queryParams.get("maxPrice")) || SLIDER_MAX);

  // Update URL when filters change
  function applyFilters(e) {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category.length > 0) params.set("category", category.join(","));
  if (minPrice !== SLIDER_MIN) params.set("minPrice", minPrice);
  if (maxPrice !== SLIDER_MAX) params.set("maxPrice", maxPrice);
    navigate(`/search?${params.toString()}`);
  }
  function resetFilters() {
  setCategory([])
  setMinPrice(SLIDER_MIN)
  setMaxPrice(SLIDER_MAX)
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    navigate(`/search?${params.toString()}`)
  }
  function removeFilter(type) {
  if (type === "category") setCategory([])
  if (type === "minPrice") setMinPrice(SLIDER_MIN)
  if (type === "maxPrice") setMaxPrice(SLIDER_MAX)
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
  if (category.length > 0) category.forEach(cat => activeFilters.push({ label: cat, type: "category" }));
  if (minPrice) activeFilters.push({ label: `Min ₹${minPrice}`, type: "minPrice" })
  if (maxPrice) activeFilters.push({ label: `Max ₹${maxPrice}`, type: "maxPrice" })

  return (
    <div className="min-h-screen text-white pt-18 pb-12">
      <div className="flex">
        
        {/* Filter Bar */}
        <form onSubmit={applyFilters} className="sticky p-4 z-30 bg-secondary rounded-md flex flex-col sm:flex-col flex-wrap gap-4 items-start mb-8 text-primary">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tag className="w-3 h-3" />
            <label className="text-sm font-medium mb-1">Category</label>
            </div>
            <div className="flex pl-2 flex-col gap-4">
              {productCategories.map(cat => (
                <label key={cat} className="flex text-xs gap-1 items-center text-black">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={category.includes(cat)}
                    onChange={e => {
                      if (e.target.checked) {
                        setCategory(prev => [...prev, cat]);
                      } else {
                        setCategory(prev => prev.filter(c => c !== cat));
                      }
                    }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          <div className="w-full flex flex-col gap-2">
            <label className="block text-xs font-medium mb-1 text-black">Price Range</label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-black">₹{minPrice}</span>
              <input
                type="range"
                min={SLIDER_MIN}
                max={maxPrice}
                step={SLIDER_STEP}
                value={minPrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  setMinPrice(val > maxPrice ? maxPrice : val);
                }}
              />
              <span className="text-xs text-black">Min</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-black">₹{maxPrice}</span>
              <input
                type="range"
                min={minPrice}
                max={SLIDER_MAX}
                step={SLIDER_STEP}
                value={maxPrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  setMaxPrice(val < minPrice ? minPrice : val);
                }}
              />
              <span className="text-xs text-black">Max</span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-white font-semibold px-4 py-2 rounded-sm cursor-pointer transition-colors"
          >
            {loading ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Loading...</span> : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-pastelpink text-secondary cursor-pointer font-semibold px-4 py-2 rounded-sm transition-colors"
          >
            Reset
          </button>
        </form>
        <div className="p-4">
        <h1 className="text-3xl font-bold text-primary mb-6">Search Results for "{query}"</h1>
        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <span key={f.type} className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                {f.label}
                <button onClick={() => removeFilter(f.type)} className="ml-2 hover:text-red-300" aria-label={`Remove ${f.label}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {loading && <div className="text-black">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && products.length === 0 && bundles.length === 0 && collections.length === 0 && (
          <div className="text-black">No results found.</div>
        )}
        {products.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-primary mb-4 mt-8">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
        {bundles.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-primary mb-4 mt-8">Bundles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-2">
              {bundles.map(bundle => (
                <BundleCard key={bundle._id} bundle={bundle} onClick={() => handleBundleClick(bundle._id)} />
              ))}
            </div>
          </>
        )}
  
      </div>
      </div>
    </div>
  )
}

export default SearchResultsPage 
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import FilterSidebar from '../components/search/FilterSidebar'
import FilterChips from '../components/search/FilterChips'
import ResultsGrid from '../components/search/ResultsGrid'
//improve Seach BE implementation improve search time
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const SLIDER_MIN = 0
const SLIDER_MAX = 10000
const SLIDER_STEP = 10

function SearchResultsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [filtersOpen])

  const queryParams = useQuery()
  const query = queryParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [bundles, setBundles] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [category, setCategory] = useState(() => {
    const cat = queryParams.get('category')
    if (!cat) return []
    return cat.split(',')
  })
  const [minPrice, setMinPrice] = useState(Number(queryParams.get('minPrice')) || SLIDER_MIN)
  const [maxPrice, setMaxPrice] = useState(Number(queryParams.get('maxPrice')) || SLIDER_MAX)

  function applyFilters(e) {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category.length > 0) params.set('category', category.join(','))
    if (minPrice !== SLIDER_MIN) params.set('minPrice', minPrice)
    if (maxPrice !== SLIDER_MAX) params.set('maxPrice', maxPrice)
    navigate(`/search?${params.toString()}`)
  }
  function resetFilters() {
    setCategory([])
    setMinPrice(SLIDER_MIN)
    setMaxPrice(SLIDER_MAX)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    navigate(`/search?${params.toString()}`)
  }
  function removeFilter(type) {
    if (type === 'category') setCategory([])
    if (type === 'minPrice') setMinPrice(SLIDER_MIN)
    if (type === 'maxPrice') setMaxPrice(SLIDER_MAX)
    setTimeout(applyFilters, 0)
  }

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([
      axios.get(
        `/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      ),
      axios.get(`/bundles/search?q=${encodeURIComponent(query)}&minPrice=${minPrice}&maxPrice=${maxPrice}`),
      axios.get(`/collections/search?q=${encodeURIComponent(query)}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
    ])
      .then(([productsRes, bundlesRes, collectionsRes]) => {
        setProducts(productsRes.data)
        setBundles(bundlesRes.data)
        setCollections(collectionsRes.data)
      })
      .catch(() => setError('Failed to fetch search results'))
      .finally(() => setLoading(false))
  }, [query, category, minPrice, maxPrice])

  function handleBundleClick(id) {
    navigate(`/bundle/${id}`)
  }

  const activeFilters = []
  if (category.length > 0) category.forEach((cat) => activeFilters.push({ label: cat, type: 'category' }))
  if (minPrice > SLIDER_MIN) activeFilters.push({ label: `Min ₹${minPrice}`, type: 'minPrice' })
  if (maxPrice < SLIDER_MAX) activeFilters.push({ label: `Max ₹${maxPrice}`, type: 'maxPrice' })

  return (
    <div className=" text-white pt-18 pb-12">
      <div className="md:hidden p-4">
        <button
          aria-label="Open filters"
          onClick={() => setFiltersOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md font-semibold"
        >
          Filters
        </button>
      </div>

      <div className="flex">
        <FilterSidebar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          category={category}
          setCategory={setCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          loading={loading}
          SLIDER_MIN={SLIDER_MIN}
          SLIDER_MAX={SLIDER_MAX}
          SLIDER_STEP={SLIDER_STEP}
        />

        <div className="flex-1">
          <FilterChips activeFilters={activeFilters} removeFilter={removeFilter} />
          <ResultsGrid
            products={products}
            bundles={bundles}
            collections={collections}
            loading={loading}
            error={error}
            query={query}
            handleBundleClick={handleBundleClick}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage

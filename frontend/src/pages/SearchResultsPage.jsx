import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import FilterSidebar from '../components/search/FilterSidebar'
import FilterChips from '../components/search/FilterChips'
import ResultsGrid from '../components/search/ResultsGrid'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const DEFAULT_MIN = 0
const DEFAULT_MAX = 5000
const SLIDER_STEP = 10

// Simple in-memory cache for price ranges
const priceRangeCache = new Map()

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

  const location = useLocation()
  const queryParams = useQuery()
  const query = queryParams.get('q') || ''
  const categoryParam = queryParams.get('category') || ''

  const [products, setProducts] = useState([])
  const [bundles, setBundles] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Slider boundaries
  const [sliderMin, setSliderMin] = useState(DEFAULT_MIN)
  const [sliderMax, setSliderMax] = useState(DEFAULT_MAX)

  // Local state for the filter form
  const [category, setCategory] = useState([])
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN)
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX)

  // Fetch price range metadata based on text query and category
  // This is cached and only called when Q or Category changes
  const fetchPriceMetadata = useCallback(async (q, cat) => {
    const cacheKey = `${q}-${cat}`
    if (priceRangeCache.has(cacheKey)) {
      const { min, max } = priceRangeCache.get(cacheKey)
      setSliderMin(min)
      setSliderMax(max)
      return { min, max }
    }

    try {
      const [productRange, bundleRange, collectionRange] = await Promise.all([
        axios.get(`/products/price-range?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}`),
        axios.get(`/bundles/price-range?q=${encodeURIComponent(q)}`),
        axios.get(`/collections/price-range?q=${encodeURIComponent(q)}`)
      ])

      const mins = [productRange.data.minPrice, bundleRange.data.minPrice, collectionRange.data.minPrice].filter(
        (p) => p !== undefined && p !== null && !isNaN(p)
      )

      const maxes = [productRange.data.maxPrice, bundleRange.data.maxPrice, collectionRange.data.maxPrice].filter(
        (p) => p !== undefined && p !== null && !isNaN(p)
      )

      let finalMin = DEFAULT_MIN
      let finalMax = DEFAULT_MAX

      if (mins.length > 0) {
        finalMin = Math.floor(Math.min(...mins) / 10) * 10
      }
      if (maxes.length > 0) {
        const foundMax = Math.max(...maxes)
        if (foundMax > 0) {
          finalMax = Math.ceil(foundMax / 10) * 10
        }
      }

      // If min and max are the same, give some room
      if (finalMin === finalMax) {
        finalMax = finalMin + 1000
      }

      priceRangeCache.set(cacheKey, { min: finalMin, max: finalMax })
      setSliderMin(finalMin)
      setSliderMax(finalMax)
      return { min: finalMin, max: finalMax }
    } catch (err) {
      console.error('Failed to fetch price metadata', err)
      return { min: DEFAULT_MIN, max: DEFAULT_MAX }
    }
  }, [])

  // Sync local state and slider boundaries with URL
  useEffect(() => {
    const q = queryParams.get('q') || ''
    const cat = queryParams.get('category') || ''

    fetchPriceMetadata(q, cat).then(({ min, max }) => {
      setCategory(cat ? cat.split(',') : [])

      const urlMin = queryParams.get('minPrice')
      const urlMax = queryParams.get('maxPrice')

      setMinPrice(urlMin !== null ? Number(urlMin) : min)
      setMaxPrice(urlMax !== null ? Number(urlMax) : max)
    })
  }, [location.search, fetchPriceMetadata])

  function applyFilters(e) {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category.length > 0) params.set('category', category.join(','))

    // Only set price params if they differ from the dynamic min/max
    if (minPrice !== sliderMin) params.set('minPrice', minPrice)
    if (maxPrice !== sliderMax) params.set('maxPrice', maxPrice)

    navigate(`/search?${params.toString()}`)
  }

  function resetFilters() {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    navigate(`/search?${params.toString()}`)
  }

  function removeFilter(type) {
    const params = new URLSearchParams(location.search)
    if (type === 'category') params.delete('category')
    if (type === 'minPrice') params.delete('minPrice')
    if (type === 'maxPrice') params.delete('maxPrice')
    navigate(`/search?${params.toString()}`)
  }

  // Final search result fetching (Debounced or triggered by URL change)
  useEffect(() => {
    const q = queryParams.get('q') || ''
    const cat = queryParams.get('category') || ''
    const minP = queryParams.get('minPrice') || ''
    const maxP = queryParams.get('maxPrice') || ''

    setLoading(true)
    setError('')
    Promise.all([
      axios.get(
        `/products/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}&minPrice=${minP}&maxPrice=${maxP}`
      ),
      axios.get(`/bundles/search?q=${encodeURIComponent(q)}&minPrice=${minP}&maxPrice=${maxP}`),
      axios.get(`/collections/search?q=${encodeURIComponent(q)}&minPrice=${minP}&maxPrice=${maxP}`)
    ])
      .then(([productsRes, bundlesRes, collectionsRes]) => {
        setProducts(productsRes.data)
        setBundles(bundlesRes.data)
        setCollections(collectionsRes.data)
      })
      .catch(() => setError('Failed to fetch search results'))
      .finally(() => setLoading(false))
  }, [location.search])

  function handleBundleClick(id) {
    navigate(`/bundle/${id}`)
  }

  const activeFilters = []
  const appliedCategory = queryParams.get('category') ? queryParams.get('category').split(',') : []
  const appliedMinPrice = queryParams.get('minPrice')
  const appliedMaxPrice = queryParams.get('maxPrice')

  if (appliedCategory.length > 0) appliedCategory.forEach((cat) => activeFilters.push({ label: cat, type: 'category' }))
  if (appliedMinPrice) activeFilters.push({ label: `Min ₹${appliedMinPrice}`, type: 'minPrice' })
  if (appliedMaxPrice) activeFilters.push({ label: `Max ₹${appliedMaxPrice}`, type: 'maxPrice' })

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
          SLIDER_MIN={sliderMin}
          SLIDER_MAX={sliderMax}
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

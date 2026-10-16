import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import axios from '../lib/axios'
import { categoryByName } from '../lib/catalog'
import { formatCurrency } from '../utils/formatCurrency'
import FilterSidebar from '../components/search/FilterSidebar'
import FilterChips from '../components/search/FilterChips'
import ResultsGrid from '../components/search/ResultsGrid'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 5000
const SLIDER_STEP = 10

// Price bounds for a query don't change while filtering, so cache them per query + category.
const priceRangeCache = new Map()

async function fetchPriceBounds(q, cat) {
  const key = `${q}|${cat}`
  if (priceRangeCache.has(key)) return priceRangeCache.get(key)
  const params = { q }
  const requests = [axios.get('/products/price-range', { params: { q, category: cat } })]
  if (!cat)
    requests.push(axios.get('/bundles/price-range', { params }), axios.get('/collections/price-range', { params }))
  const results = await Promise.all(requests)
  const mins = results.map((r) => r.data.minPrice).filter((p) => Number.isFinite(p) && p > 0)
  const maxes = results.map((r) => r.data.maxPrice).filter((p) => Number.isFinite(p) && p > 0)
  let min = mins.length ? Math.floor(Math.min(...mins) / 10) * 10 : DEFAULT_MIN
  let max = maxes.length ? Math.ceil(Math.max(...maxes) / 10) * 10 : DEFAULT_MAX
  if (min >= max) max = min + 100
  const bounds = { min, max }
  priceRangeCache.set(key, bounds)
  return bounds
}

function SearchResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const query = params.get('q') || ''
  const categoryParam = params.get('category') || ''
  const minParam = params.get('minPrice')
  const maxParam = params.get('maxPrice')

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [results, setResults] = useState({ products: [], bundles: [], collections: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bounds, setBounds] = useState({ min: DEFAULT_MIN, max: DEFAULT_MAX })

  // filter form state (applied to the URL on submit)
  const [category, setCategory] = useState([])
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN)
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX)

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [filtersOpen])

  // Sync the form with the URL and load price bounds for the slider.
  useEffect(() => {
    setCategory(categoryParam ? categoryParam.split(',') : [])
    fetchPriceBounds(query, categoryParam)
      .catch(() => ({ min: DEFAULT_MIN, max: DEFAULT_MAX }))
      .then((b) => {
        setBounds(b)
        setMinPrice(minParam !== null ? Number(minParam) : b.min)
        setMaxPrice(maxParam !== null ? Number(maxParam) : b.max)
      })
  }, [query, categoryParam, minParam, maxParam])

  // Fetch results whenever the URL changes.
  useEffect(() => {
    let cancelled = false
    const price = { minPrice: minParam ?? undefined, maxPrice: maxParam ?? undefined }
    setLoading(true)
    setError('')
    Promise.all([
      axios.get('/products/search', { params: { q: query, category: categoryParam || undefined, ...price } }),
      // bundles and collections span categories, so hide them while a category filter is active
      categoryParam ? { data: [] } : axios.get('/bundles/search', { params: { q: query, ...price } }),
      categoryParam ? { data: [] } : axios.get('/collections/search', { params: { q: query, ...price } })
    ])
      .then(([p, b, c]) => {
        if (!cancelled) setResults({ products: p.data, bundles: b.data, collections: c.data })
      })
      .catch(() => !cancelled && setError('Something went wrong loading results. Please try again.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [query, categoryParam, minParam, maxParam])

  function pushParams(next) {
    const s = next.toString()
    navigate(s ? `/search?${s}` : '/search')
  }

  function applyFilters(e) {
    e?.preventDefault()
    const next = new URLSearchParams()
    if (query) next.set('q', query)
    if (category.length) next.set('category', category.join(','))
    const lo = Math.max(bounds.min, Math.min(Number(minPrice) || bounds.min, bounds.max))
    const hi = Math.min(bounds.max, Math.max(Number(maxPrice) || bounds.max, lo))
    if (lo > bounds.min) next.set('minPrice', lo)
    if (hi < bounds.max) next.set('maxPrice', hi)
    pushParams(next)
  }

  function resetFilters() {
    pushParams(new URLSearchParams(query ? { q: query } : {}))
  }

  function removeFilter(type, value) {
    const next = new URLSearchParams(location.search)
    if (type === 'category') {
      const remaining = categoryParam.split(',').filter((c) => c !== value)
      if (remaining.length) next.set('category', remaining.join(','))
      else next.delete('category')
    } else {
      next.delete(type)
    }
    pushParams(next)
  }

  const activeFilters = [
    ...(categoryParam
      ? categoryParam.split(',').map((c) => ({ type: 'category', value: c, label: categoryByName(c)?.short || c }))
      : []),
    ...(minParam ? [{ type: 'minPrice', value: minParam, label: `From ${formatCurrency(Number(minParam))}` }] : []),
    ...(maxParam ? [{ type: 'maxPrice', value: maxParam, label: `Up to ${formatCurrency(Number(maxParam))}` }] : [])
  ]

  const total = results.products.length + results.bundles.length + results.collections.length

  return (
    <div className="container-page pt-10 pb-24">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {!loading && (
              <p className="mb-1.5 text-sm text-muted">
                {total} result{total === 1 ? '' : 's'}
              </p>
            )}
            <h1 className="heading-display text-[40px] leading-tight sm:text-[44px]">
              {query ? `Results for “${query}”` : 'All plants'}
            </h1>
          </div>
          <button type="button" onClick={() => setFiltersOpen(true)} className="btn-outline h-11 md:hidden">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters{activeFilters.length ? ` (${activeFilters.length})` : ''}
          </button>
        </div>
        <FilterChips activeFilters={activeFilters} removeFilter={removeFilter} />
      </header>

      <div className="grid items-start gap-10 md:grid-cols-[260px_minmax(0,1fr)]">
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
          sliderMin={bounds.min}
          sliderMax={bounds.max}
          sliderStep={SLIDER_STEP}
        />
        <ResultsGrid {...results} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default SearchResultsPage

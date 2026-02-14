import { Tag, X, IndianRupee } from 'lucide-react'
import PriceRangeSlider from '../PriceRangeSlider'

const productCategories = [
  'Ornamental Houseplants',
  'Flowering Bedding Plants',
  'Herbs and Edible Plants',
  'Succulents and Cacti',
  'Fruit Trees and Bushes',
  'Vegetable Plants and Seedlings',
  'Indoor Air-Purifying Plants'
]

const FilterSidebar = ({
  filtersOpen,
  setFiltersOpen,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  applyFilters,
  resetFilters,
  loading,
  SLIDER_MIN,
  SLIDER_MAX,
  SLIDER_STEP
}) => {
  return (
    <>
      {filtersOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setFiltersOpen(false)} />
      )}

      <form
        onSubmit={(e) => {
          applyFilters(e)
          setFiltersOpen(false)
        }}
        className={`
          fixed md:sticky
          top-16 md:top-0
          left-0
          h-[calc(100vh-64px)] md:h-auto
          bg-secondary p-4
          z-40
          w-65 max-w-xs
          transform transition-transform duration-300
          ${filtersOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          md:relative
          rounded-md
          flex flex-col gap-4
          text-primary
        `}
      >
        <div className="flex justify-between items-center md:hidden mb-2">
          <span className="font-semibold text-black">Filters</span>
          <button type="button" onClick={() => setFiltersOpen(false)}>
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tag className="w-3 h-3" />
          <label className="text-sm font-medium mb-1">Category</label>
        </div>
        <div className="flex pl-2 flex-col gap-4">
          {productCategories.map((cat) => (
            <label key={cat} className="flex text-xs gap-1 items-center text-black">
              <input
                type="checkbox"
                value={cat}
                checked={category.includes(cat)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCategory((prev) => [...prev, cat])
                  } else {
                    setCategory((prev) => prev.filter((c) => c !== cat))
                  }
                }}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <IndianRupee className="w-3 h-3 " />
          <label className="text-sm font-medium mb-1">Price</label>
        </div>

        <PriceRangeSlider
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={SLIDER_STEP}
          minVal={minPrice}
          maxVal={maxPrice}
          setMinVal={setMinPrice}
          setMaxVal={setMaxPrice}
        />
        <button
          type="submit"
          className="bg-primary text-white font-semibold px-4 py-2 rounded-sm cursor-pointer transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>{' '}
              Loading...
            </span>
          ) : (
            'Apply Filters'
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            resetFilters()
            setFiltersOpen(false) // close on mobile
          }}
          className="bg-primary/80 text-white font-medium px-4 py-1.5 rounded-sm cursor-pointer transition-colors text-sm hover:bg-primary"
        >
          Clear all filters
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="bg-pastelpink text-secondary cursor-pointer font-semibold px-4 py-2 rounded-sm transition-colors"
        >
          Reset
        </button>
      </form>
    </>
  )
}

export default FilterSidebar

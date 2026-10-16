import { X } from 'lucide-react'
import PriceRangeSlider from '../PriceRangeSlider'
import { CATEGORIES } from '../../lib/catalog'

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
  sliderMin,
  sliderMax,
  sliderStep
}) => {
  return (
    <>
      {filtersOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 md:hidden"
          onClick={() => setFiltersOpen(false)}
          aria-hidden="true"
        />
      )}

      <form
        aria-label="Filters"
        onSubmit={(e) => {
          applyFilters(e)
          setFiltersOpen(false)
        }}
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col gap-6 overflow-y-auto bg-surface p-6 transition-transform duration-300 md:sticky md:top-24 md:z-0 md:w-auto md:max-w-none md:translate-x-0 md:rounded-3xl md:border md:border-line ${filtersOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between md:hidden">
          <span className="text-lg font-bold">Filters</span>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sage"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow mb-3 text-xs">Category</legend>
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-3 text-[15px]">
              <input
                type="checkbox"
                value={cat.name}
                checked={category.includes(cat.name)}
                onChange={(e) =>
                  setCategory((prev) => (e.target.checked ? [...prev, cat.name] : prev.filter((c) => c !== cat.name)))
                }
                className="h-[18px] w-[18px] shrink-0 accent-moss"
              />
              {cat.short}
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow mb-3 text-xs">Price</legend>
          <PriceRangeSlider
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            minVal={minPrice}
            maxVal={maxPrice}
            setMinVal={setMinPrice}
            setMaxVal={setMaxPrice}
          />
        </fieldset>

        <div className="flex flex-col gap-1">
          <button type="submit" className="btn-primary">
            Apply filters
          </button>
          <button
            type="button"
            onClick={() => {
              resetFilters()
              setFiltersOpen(false)
            }}
            className="h-11 rounded-full font-medium underline underline-offset-4 hover:bg-sage"
          >
            Clear all
          </button>
        </div>
      </form>
    </>
  )
}

export default FilterSidebar

import { X } from 'lucide-react'

const FilterChips = ({ activeFilters, removeFilter }) => {
  if (activeFilters.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {activeFilters.map((f) => (
        <li
          key={`${f.type}-${f.value}`}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-ink pr-1.5 pl-3.5 text-sm font-medium text-ground"
        >
          {f.label}
          <button
            type="button"
            onClick={() => removeFilter(f.type, f.value)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-night hover:bg-clay"
            aria-label={`Remove filter ${f.label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default FilterChips

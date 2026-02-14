import { X } from 'lucide-react'

const FilterChips = ({ activeFilters, removeFilter }) => {
  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map((f) => (
        <span
          key={`${f.type}-${f.label}`}
          className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-xs font-medium"
        >
          {f.label}
          <button
            onClick={() => removeFilter(f.type)}
            className="ml-2 hover:text-red-300"
            aria-label={`Remove ${f.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

export default FilterChips

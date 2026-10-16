import { Minus, Plus } from 'lucide-react'

function QuantityPicker({ value, onChange, min = 1, max = 99, size = 'lg', label = 'Quantity' }) {
  const s = size === 'lg' ? 'h-[52px]' : 'h-10'
  const b = size === 'lg' ? 'w-12' : 'w-9'
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center rounded-full border-[1.5px] border-ink ${s}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={value <= min && min > 0}
        className={`flex h-full ${b} items-center justify-center rounded-full hover:bg-sage disabled:opacity-40`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-7 text-center font-bold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={`flex h-full ${b} items-center justify-center rounded-full hover:bg-sage disabled:opacity-40`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export default QuantityPicker

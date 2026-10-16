import { Slider } from './ui/slider'

const PriceRangeSlider = ({ min = 0, max = 5000, step = 10, minVal, maxVal, setMinVal, setMaxVal }) => {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
  const sliderValues = [clamp(Number(minVal) || min, min, max), clamp(Number(maxVal) || max, min, max)]

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1 pt-1">
        <Slider
          min={min}
          max={max}
          step={step}
          value={sliderValues}
          onValueChange={([lo, hi]) => {
            setMinVal(lo)
            setMaxVal(hi)
          }}
          minStepsBetweenThumbs={1}
          aria-label="Price range"
        />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex flex-col gap-1 text-[13px] text-muted">
          Min (₹)
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={minVal}
            onChange={(e) => setMinVal(e.target.value === '' ? '' : Number(e.target.value))}
            onBlur={() => setMinVal(clamp(Number(minVal) || min, min, sliderValues[1]))}
            className="field h-10"
          />
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-muted">
          Max (₹)
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => setMaxVal(e.target.value === '' ? '' : Number(e.target.value))}
            onBlur={() => setMaxVal(clamp(Number(maxVal) || max, sliderValues[0], max))}
            className="field h-10"
          />
        </label>
      </div>
    </div>
  )
}

export default PriceRangeSlider

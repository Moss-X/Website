import React from 'react'
import { Slider } from './ui/slider'

const PriceRangeSlider = ({ min = 0, max = 10000, step = 10, minVal, maxVal, setMinVal, setMaxVal }) => {
  const handleValueChange = (values) => {
    setMinVal(values[0])
    setMaxVal(values[1])
  }

  const handleMinInput = (e) => {
    const value = e.target.value
    if (value === '') {
      setMinVal('')
      return
    }
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue <= maxVal && numValue >= min) {
      setMinVal(numValue)
    }
  }

  const handleMaxInput = (e) => {
    const value = e.target.value
    if (value === '') {
      setMaxVal('')
      return
    }
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= minVal && numValue <= max) {
      setMaxVal(numValue)
    }
  }

  // Ensure values are within range and not empty for the slider
  const sliderValues = [typeof minVal === 'number' ? minVal : min, typeof maxVal === 'number' ? maxVal : max]

  return (
    <div className="w-full max-w-md bg-secondary rounded-lg px-2 space-y-6">
      {/* Price Inputs */}
      <div className="flex items-center gap-4">
        <div className="flex flex-row gap-2 items-center flex-1">
          <label className="text-xs text-black">Min</label>
          <input
            type="number"
            value={minVal}
            onChange={handleMinInput}
            className="border border-darkGray rounded-md text-center text-sm p-2 w-20 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-black"
          />
        </div>
        <span className="text-sm font-medium text-black">-</span>
        <div className="flex flex-row gap-2 items-center flex-1">
          <input
            type="number"
            value={maxVal}
            onChange={handleMaxInput}
            className="border border-darkGray rounded-md text-center text-sm p-2 w-20 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-black"
          />
          <label className="text-sm text-black">Max</label>
        </div>
      </div>

      {/* Shadcn Slider */}
      <div className="px-1">
        <Slider
          min={min}
          max={max}
          step={step}
          value={sliderValues}
          onValueChange={handleValueChange}
          minStepsBetweenThumbs={1}
        />
      </div>
    </div>
  )
}

export default PriceRangeSlider

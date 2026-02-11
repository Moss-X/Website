import React, { useState } from "react";

const PriceRangeSlider = ({
  min = 0,
  max = 10000,
  step = 10, // Changed increment to 10
  gap = 10,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
}) => {
  const handleMinInput = (e) => {
    let value = parseInt(e.target.value);
    if (maxVal - value >= gap && value >= min) {
      setMinVal(value);
    }
  };

  const handleMaxInput = (e) => {
    let value = parseInt(e.target.value);
    if (value - minVal >= gap && value <= max) {
      setMaxVal(value);
    }
  };

  const handleRangeMin = (e) => {
    let value = parseInt(e.target.value);
    if (maxVal - value >= gap) {
      setMinVal(value);
    }
  };

  const handleRangeMax = (e) => {
    let value = parseInt(e.target.value);
    if (value - minVal >= gap) {
      setMaxVal(value);
    }
  };

  return (
    <div className="w-full max-w-md bg-secondary rounded-lg shadow-xs px-2 space-y-6">

      {/* Price Inputs */}
      <div className="flex items-center gap-4">
        <div className="flex flex-row gap-2 items-center flex-1">
          <label className="text-xs text-black mb-1">Min</label>
          <input
            type="number"
            value={minVal}
            onChange={handleMinInput}
            className=" border border-darkGray rounded-md text-center text-sm p-2 w-10 focus:outline-hidden focus:ring-2 focus:ring-primary bg-white text-black"
          />
        </div>
        <span className="text-sm     font-medium text-black">-</span>
        <div className="flex flex-row gap-2 items-center flex-1">
          <input
            type="number"
            value={maxVal}
            onChange={handleMaxInput}
            className="border border-darkGray rounded-md text-center text-sm p-2 w-10 focus:outline-hidden focus:ring-2 focus:ring-primary bg-white text-black"
          />
                      <label className="text-sm text-black mb-1">Max</label>

        </div>
      </div>

      {/* Slider */}
      <div className="relative h-2 rounded bg-gray-300">
        {/* Progress */}
        <div
          className="absolute h-2 bg-primary rounded"
          style={{
            left: `${(minVal / max) * 100}%`,
            right: `${100 - (maxVal / max) * 100}%`,
          }}
        ></div>

        {/* Range Inputs */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleRangeMin}
          className="absolute w-full h-2 top-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleRangeMax}
          className="absolute w-full h-2 top-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto"
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;

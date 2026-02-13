import React from 'react'

function ProductActions({ onAddToCart, onBuyNow }) {
  return (
    <div className="flex gap-4 py-4 px-4 md:p-0 justify-center md:justify-start w-full max-w-(--breakpoint-xl) mx-auto">
      <button
        className="px-6 py-3 flex bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition whitespace-nowrap font-semibold text-lg"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>
      <button
        className="px-6 py-3 flex bg-secondary text-black rounded-full shadow-md hover:bg-gray-200 transition whitespace-nowrap font-semibold text-lg"
        onClick={onBuyNow}
      >
        Buy Now
      </button>
    </div>
  )
}

export default ProductActions

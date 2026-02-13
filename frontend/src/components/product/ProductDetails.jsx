import React, { useState } from 'react'

function ProductDetails({ name, description, price }) {
  const [showFullDesc, setShowFullDesc] = useState(false)

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-2">{/* Badge placeholder */}</div>
      <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 text-center md:text-left">{name}</h1>
      <div className="mb-4 w-full">
        <p className={`text-lg text-black text-center md:text-left ${showFullDesc ? '' : 'line-clamp-3'}`}>
          {description}
        </p>
        {description.length > 120 && (
          <button className="text-primary hover:underline text-sm mt-2" onClick={() => setShowFullDesc((v) => !v)}>
            {showFullDesc ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-black font-bold text-2xl">₹{price}</span>
      </div>
    </div>
  )
}

export default ProductDetails

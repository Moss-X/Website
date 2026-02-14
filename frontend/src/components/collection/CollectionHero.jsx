import React from 'react'

const CollectionHero = ({
  collection,
  isBestValue,
  savings,
  discountRatio,
  showFullDesc,
  setShowFullDesc,
  handleAddToCart,
  handleBuyNow
}) => {
  return (
    <section className="relative w-full max-w-(--breakpoint-xl) mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
        <div className="bg-gray rounded-xl flex items-center justify-center w-full aspect-square max-w-md mb-4 md:mb-0">
          <img src={collection.image} alt={collection.title} className="w-full h-full object-contain rounded-xl" />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
        <div className="flex gap-2 mb-2">
          {isBestValue && (
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Best Value
            </span>
          )}
          {savings > 0 && (
            <span className="bg-secondary text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Save ₹{savings}
            </span>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 text-center md:text-left">{collection.title}</h1>
        <div className="mb-4 w-full">
          <p className={`text-lg text-black text-center md:text-left ${showFullDesc ? '' : 'line-clamp-3'}`}>
            {collection.description}
          </p>
          {collection.description && collection.description.length > 120 && (
            <button className="text-primary hover:underline text-sm mt-2" onClick={() => setShowFullDesc((v) => !v)}>
              {showFullDesc ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-black font-bold text-2xl">₹{collection.discountedPrice || collection.totalPrice}</span>
          {collection.discountedPrice && collection.discountedPrice < collection.totalPrice && (
            <>
              <span className="text-gray-400 line-through text-2xl">₹{collection.totalPrice}</span>
              <span className="text-primary text-lg">({Math.round((1 - discountRatio) * 100)}% off)</span>
            </>
          )}
        </div>
        {/* Sticky Action Bar (mobile/desktop) */}
        <div className="flex gap-4 py-4 px-4 md:p-0 justify-center md:justify-start w-full max-w-(--breakpoint-xl) mx-auto">
          <button
            className="px-6 py-3 flex bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition whitespace-nowrap font-semibold text-lg"
            onClick={handleAddToCart}
          >
            Add Collection to Cart
          </button>
          <button
            className="px-6 py-3 flex bg-secondary text-black rounded-full shadow-md hover:bg-gray-200 transition whitespace-nowrap font-semibold text-lg"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </section>
  )
}

export default CollectionHero

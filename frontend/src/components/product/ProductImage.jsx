import React from 'react'

function ProductImage({ image, name }) {
  return (
    <div className="bg-gray rounded-xl flex items-center justify-center w-full aspect-square max-w-md mb-4 md:mb-0">
      <img src={image} alt={name} className="w-full h-full object-contain rounded-xl" />
    </div>
  )
}

export default ProductImage

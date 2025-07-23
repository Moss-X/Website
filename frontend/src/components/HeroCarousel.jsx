import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"
import { useNavigate } from "react-router-dom"

function HeroCarousel({ featuredProducts }) {
  const [current, setCurrent] = useState(0)
  const total = featuredProducts.length
  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  function next() {
    setCurrent((prev) => (prev + 1) % total)
  }
  function prev() {
    setCurrent((prev) => (prev - 1 + total) % total)
  }

  if (!featuredProducts.length) return null
  const product = featuredProducts[current]

  function handleAddToCart() {
    addToCart(product)
  }
  function handleBuyNow() {
    navigate(`/product/${product._id}`)
  }

  return (
    <section className="w-screen max-w-none flex flex-col md:flex-row items-center justify-between bg-gray-900 rounded-none shadow-lg overflow-hidden min-h-[500px] md:min-h-[600px] relative left-1/2 right-1/2 -mx-[50vw] md:-mx-[50vw] md:left-1/2 md:right-1/2" style={{ left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      {/* Carousel Left */}
      <div className="relative w-full md:w-2/3 h-[350px] md:h-[600px] flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-end">
          <div className="max-w-7xl md:ml-28 mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-300 mb-2 drop-shadow-lg">{product.name}</h2>
            <p className="text-2xl md:text-2xl text-white mb-4 max-w-2xl drop-shadow-lg line-clamp-2 overflow-hidden">{product.description}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleBuyNow}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg text-lg transition-colors duration-200"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-white/90 hover:bg-white text-emerald-700 font-semibold py-2 px-6 rounded-lg text-lg transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg focus:outline-none"
          aria-label="Previous"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg focus:outline-none"
          aria-label="Next"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredProducts.map((_, idx) => (
            <span
              key={idx}
              className={`block w-4 h-4 rounded-full ${idx === current ? "bg-emerald-400" : "bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
      {/* Branding Right */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-8 h-[350px] md:h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]">
        <img src="/icon.png" alt="Moss-x Icon" className="w-32 h-32 md:w-48 md:h-48 mb-6 drop-shadow-2xl" />
        <span className="text-7xl md:text-8xl font-bold text-white tracking-tight drop-shadow-xl select-none text-center">
          MOSS-<span className="text-emerald-400">X</span>
        </span>
      </div>
    </section>
  )
}

export default HeroCarousel 
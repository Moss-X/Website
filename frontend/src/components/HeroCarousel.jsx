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
    <section className="w-screen max-w-none flex flex-col md:flex-row items-center justify-between bg-secondary rounded-none shadow-lg overflow-hidden  md:min-h-[700px] relative left-1/2 right-1/2 -mx-[50vw] md:-mx-[50vw] md:left-1/2 md:right-1/2" style={{ left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      {/* Carousel Left */}
      <div className="relative w-full md:w-2/3 h-[350px] md:h-[700px] flex items-center justify-center">
        {/* Controls */}

      </div>
      {/* Branding Right */}
      <div className="hidden md:flex w-full md:w-1/3 flex-col items-center justify-center p-8 h-[350px] md:h-[700px] bg-primary">
        <img src="/icon.png" alt="Moss-x Icon" className="w-32 h-32 md:w-48 md:h-48 mb-6 drop-shadow-2xl" />
        <span className="text-7xl md:text-8xl font-bold text-white tracking-tight drop-shadow-xl select-none text-center">
          MOSS-<span className="text-emerald-400">X</span>
        </span>
      </div>
    </section>
  )
}

export default HeroCarousel 
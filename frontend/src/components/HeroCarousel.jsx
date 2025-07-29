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
    <section className="w-screen max-w-none flex flex-col md:flex-row items-center justify-center md:justify-between bg-secondary rounded-none shadow-lg overflow-hidden  md:min-h-[700px] relative -mx-[50vw] md:-mx-[50vw] md:left-1/2 md:right-1/2 h-[500px] pt-12 md:pt-0" style={{ left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      {/*Left */}
      <div className="bg-secondary w-full md:w-2/3 h-[350px] md:h-auto flex items-center justify-center">
        <div className="text-left px-8 md:px-16">
          <h1 className="text-4xl md:text-6xl font-bold text-heading leading-tight ">
            Think Green and<br />
            <span className="text-primary z-10">Plant Something</span>
          </h1>
          <p className="mt-4 text-lg text-heading/70 max-w-md z-10">
            Find your dream plants for your home decorations with us, and we will make it happen.
          </p>
          <button className="mt-6 z-10 px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-darkGreen transition">
            🌿 Shop Now
          </button>
        </div>
      </div>
      <img src="/heroPlant.png" alt="" srcset="" className=" absolute h-52 md:hidden bottom-0 right-0" />
      {/* Branding Right */}
      <div className="hidden md:flex relative w-full md:w-1/3 md:h-[700px] bg-primary items-center justify-center">
        <img src="/heroPlant.png" alt="Moss-x Icon" className="z-[0] absolute top-5/8 -translate-y-1/2 -translate-x-1/2 md:min-h-full mb-6 drop-shadow-2xl object-cover " />
      </div>
    </section>
  )
}

export default HeroCarousel 
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axios from '../lib/axios'

// Suggestions are random, so fetch once per visit rather than every time the cart changes.
const PeopleAlsoBought = ({ exclude = [] }) => {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    axios
      .get('/products/recommendations', { params: { exclude: exclude.join(',') } })
      .then((res) => setRecommendations(res.data))
      .catch(() => setRecommendations([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visible = recommendations.filter((p) => !exclude.includes(p._id)).slice(0, 3)
  if (!visible.length) return null

  return (
    <section aria-labelledby="also-bought-heading" className="mt-14">
      <h2 id="also-bought-heading" className="heading-display mb-6 text-[28px]">
        You might also like
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6">
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}
export default PeopleAlsoBought

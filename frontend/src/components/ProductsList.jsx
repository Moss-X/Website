import { motion } from 'framer-motion'
import { Trash, Star } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore()

  return (
    <motion.div
      className="bg-surface border border-line rounded-2xl overflow-x-auto max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className=" min-w-full divide-y divide-line">
        <thead className="bg-ground">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ink uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ink uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ink uppercase tracking-wider">
              Category
            </th>

            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ink uppercase tracking-wider">
              Featured
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ink uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-surface border border-line divide-y divide-line">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-ground">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Link to={`/product/${product._id}`} className="flex items-center group">
                    <div className="shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-moss transition"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white group-hover:text-moss transition">
                        {product.name}
                      </div>
                    </div>
                  </Link>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-ink">{formatCurrency(product.price)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-ink">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  aria-label={product.isFeatured ? `Unfeature ${product.name}` : `Feature ${product.name}`}
                  aria-pressed={product.isFeatured}
                  className={`p-1 rounded-full ${
                    product.isFeatured ? 'bg-clay text-white' : 'bg-sage text-ink'
                  } hover:bg-clay hover:text-white transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => window.confirm(`Delete "${product.name}"?`) && deleteProduct(product._id)}
                  aria-label={`Delete ${product.name}`}
                  className="text-clay hover:text-ink"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
export default ProductsList

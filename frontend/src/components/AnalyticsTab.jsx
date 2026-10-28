import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import axios from '../lib/axios'
import { Users, Package, ShoppingCart, IndianRupee } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dailySalesData, setDailySalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get('/analytics')
        setAnalyticsData(response.data.analyticsData)
        setDailySalesData(response.data.dailySalesData)
        setTopProducts(response.data.topProducts || [])
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (isLoading) {
    return <div className="text-center text-muted">Loading analytics…</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard title="Total Users" value={analyticsData.users.toLocaleString()} icon={Users} />
        <AnalyticsCard title="Total Products" value={analyticsData.products.toLocaleString()} icon={Package} />
        <AnalyticsCard title="Total Sales" value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} />
        <AnalyticsCard
          title="Total Revenue"
          value={`₹${Math.round(analyticsData.totalRevenue).toLocaleString('en-IN')}`}
          icon={IndianRupee}
        />
      </div>
      <motion.div
        className="bg-surface border border-line rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E0D5" />
            <XAxis dataKey="date" stroke="#5B6657" tickFormatter={(d) => d.slice(5)} />
            <YAxis yAxisId="left" stroke="#5B6657" />
            <YAxis yAxisId="right" orientation="right" stroke="#5B6657" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#4F6A47" activeDot={{ r: 8 }} name="Sales" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#B4532A"
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      {topProducts.length > 0 && (
        <motion.div
          className="bg-surface border border-line rounded-2xl p-6 mt-8 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h3 className="text-ink text-lg font-bold mb-4">Top sellers</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="pb-2 font-semibold">Item</th>
                <th className="pb-2 font-semibold text-right">Units</th>
                <th className="pb-2 font-semibold text-right">Orders</th>
                <th className="pb-2 font-semibold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item) => (
                <tr key={`${item.itemType}-${item._id}`} className="border-t border-line">
                  <td className="py-2 text-ink">{item.name}</td>
                  <td className="py-2 text-right tabular-nums">{item.unitsSold}</td>
                  <td className="py-2 text-right tabular-nums">{item.orders}</td>
                  <td className="py-2 text-right tabular-nums">₹{Math.round(item.revenue).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
export default AnalyticsTab

const AnalyticsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className="bg-surface border border-line rounded-2xl p-6 overflow-hidden relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-moss text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-ink text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute -bottom-4 -right-4 text-sage">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
)

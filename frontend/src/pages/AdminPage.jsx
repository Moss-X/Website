import { BarChart, PlusCircle, ShoppingBasket, Layers3, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import AnalyticsTab from '../components/AnalyticsTab'
import CreateProductForm from '../components/CreateProductForm'
import ProductsList from '../components/ProductsList'
import { useProductStore } from '../stores/useProductStore'
import CreateBundleForm from '../components/CreateBundleForm'
import BundlesList from '../components/BundlesList'
import CreateCollectionForm from '../components/CreateCollectionForm'
import CollectionsList from '../components/CollectionsList'

const tabs = [
  { id: 'create', label: 'Create Product', icon: PlusCircle },
  { id: 'products', label: 'Products', icon: ShoppingBasket },
  { id: 'bundles', label: 'Bundles', icon: Layers3 },
  { id: 'collections', label: 'Collections', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart }
]

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('create')
  const { fetchAllProducts } = useProductStore()

  useEffect(() => {
    fetchAllProducts()
  }, [fetchAllProducts])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="heading-display text-[44px] mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 h-11 rounded-full font-medium transition-colors duration-200 ${
                activeTab === tab.id ? 'bg-ink text-ground' : 'bg-sage text-ink hover:bg-sage-strong'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'create' && <CreateProductForm />}
        {activeTab === 'products' && <ProductsList />}
        {activeTab === 'bundles' && (
          <div className="flex flex-col gap-8">
            <CreateBundleForm />
            <BundlesList />
          </div>
        )}
        {activeTab === 'collections' && (
          <div className="flex flex-col gap-8">
            <CreateCollectionForm />
            <CollectionsList />
          </div>
        )}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  )
}
export default AdminPage

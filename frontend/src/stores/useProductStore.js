import { create } from 'zustand'
import toast from 'react-hot-toast'
import axios from '../lib/axios'

const errorMessage = (error, fallback) => error.response?.data?.message || error.response?.data?.error || fallback

export const useProductStore = create((set) => ({
  // admin catalogue and category listings
  products: [],
  // home page best sellers (kept separate so other pages don't overwrite them)
  featured: [],
  loading: false,
  featuredLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const res = await axios.post('/products', productData)
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false
      }))
      toast.success(`${res.data.name} created`)
      return true
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to create product'))
      set({ loading: false })
      return false
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get('/products')
      set({ products: response.data.products, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false })
      toast.error(errorMessage(error, 'Failed to fetch products'))
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true, error: null, products: [] })
    try {
      const response = await axios.get(`/products/category/${encodeURIComponent(category)}`)
      set({ products: response.data.products, loading: false })
    } catch (error) {
      set({ error: errorMessage(error, 'Failed to fetch products'), loading: false })
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true })
    try {
      await axios.delete(`/products/${productId}`)
      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => product._id !== productId),
        loading: false
      }))
    } catch (error) {
      set({ loading: false })
      toast.error(errorMessage(error, 'Failed to delete product'))
    }
  },
  toggleFeaturedProduct: async (productId) => {
    try {
      const response = await axios.patch(`/products/${productId}`)
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
        )
      }))
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to update product'))
    }
  },
  fetchFeaturedProducts: async () => {
    set({ featuredLoading: true })
    try {
      const response = await axios.get('/products/featured')
      set({ featured: response.data, featuredLoading: false })
    } catch {
      set({ featuredLoading: false })
    }
  }
}))

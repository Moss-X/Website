import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from 'react-hot-toast'
import { unitPrice, itemTitle } from '../lib/catalog'

// Guests get a random session id so their cart can live on the server and be merged on login.
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11)
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

const setSessionHeader = () => {
  const sessionId = getSessionId()
  axios.defaults.headers.common['x-session-id'] = sessionId
  return sessionId
}

const clearSessionHeader = () => {
  delete axios.defaults.headers.common['x-session-id']
}

const getUser = async () => {
  const { useUserStore } = await import('./useUserStore')
  return useUserStore.getState()
}

const TOAST_LABEL = { product: 'Added to cart', bundle: 'Bundle added to cart', collection: 'Collection added to cart' }

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  shippingAddress: null,
  loading: false,

  // Guests send the session header; signed-in users rely on their auth cookie.
  initializeSession: async () => {
    const { user } = await getUser()
    if (user) clearSessionHeader()
    else setSessionHeader()
  },

  getMyCoupon: async () => {
    try {
      const response = await axios.get('/coupons')
      set({ coupon: response.data })
    } catch {
      set({ coupon: null })
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post('/coupons/validate', { code })
      set({ coupon: response.data, isCouponApplied: true })
      get().calculateTotals()
      toast.success('Coupon applied')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon')
    }
  },
  removeCoupon: () => {
    set({ isCouponApplied: false })
    get().calculateTotals()
    toast.success('Coupon removed')
  },

  getCartItems: async () => {
    set({ loading: true })
    try {
      // Wait for the initial auth check so a signed-in user isn't fetched as a guest.
      const { useUserStore } = await import('./useUserStore')
      const start = Date.now()
      while (useUserStore.getState().checkingAuth && Date.now() - start < 3000) {
        await new Promise((r) => setTimeout(r, 60))
      }
      if (useUserStore.getState().user) clearSessionHeader()
      else setSessionHeader()

      const res = await axios.get('/cart', { params: { _ts: Date.now() } })
      set({ cart: res.data, loading: false })
      get().calculateTotals()
    } catch {
      set({ cart: [], loading: false })
    }
  },
  clearCart: async () => {
    try {
      await axios.delete('/cart', { data: {} })
    } catch {
      /* the server clears a paid user's cart itself */
    }
    set({ cart: [], coupon: null, isCouponApplied: false, total: 0, subtotal: 0 })
  },

  addItem: async (item, type = 'product', quantity = 1) => {
    try {
      const { user } = await getUser()
      if (!user) setSessionHeader()

      await axios.post('/cart', { refId: item._id, type })
      const existing = get().cart.find((i) => i._id === item._id && i.type === type)
      const newQuantity = (existing?.quantity || 0) + quantity
      if (quantity > 1) {
        await axios.put(`/cart/${item._id}`, { refId: item._id, type, quantity: newQuantity })
      }

      set((state) => ({
        cart: existing
          ? state.cart.map((i) => (i._id === item._id && i.type === type ? { ...i, quantity: newQuantity } : i))
          : [...state.cart, { ...item, type, quantity }]
      }))
      get().calculateTotals()
      toast.success(`${TOAST_LABEL[type]}: ${itemTitle(item)}`, { id: `add-${item._id}` })
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart')
      return false
    }
  },
  addToCart: (product, quantity = 1) => get().addItem(product, 'product', quantity),
  addBundleToCart: (bundle) => get().addItem(bundle, 'bundle'),
  addCollectionToCart: (collection) => get().addItem(collection, 'collection'),

  removeFromCart: async (id, type) => {
    try {
      await axios.delete(`/cart`, { data: { refId: id, type } })
      set((prevState) => ({
        cart: prevState.cart.filter((item) => !(item._id === id && item.type === type))
      }))
      get().calculateTotals()
    } catch {
      toast.error('Failed to remove item')
    }
  },
  updateQuantity: async (id, quantity, type) => {
    if (quantity < 1) return get().removeFromCart(id, type)
    try {
      await axios.put(`/cart/${id}`, { refId: id, type, quantity })
      set((prevState) => ({
        cart: prevState.cart.map((item) => (item._id === id && item.type === type ? { ...item, quantity } : item))
      }))
      get().calculateTotals()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity')
    }
  },
  calculateTotals: () => {
    const { cart, coupon, isCouponApplied } = get()
    const subtotal = cart.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0)
    const discount = coupon && isCouponApplied ? subtotal * (coupon.discountPercentage / 100) : 0
    set({ subtotal, total: subtotal - discount })
  },

  setShippingAddress: (address) => {
    set({ shippingAddress: address })
  },

  // Merge guest cart with user cart after login
  mergeGuestCart: async () => {
    try {
      setSessionHeader()
      const response = await axios.post('/cart/merge')
      clearSessionHeader()
      if (response.data.message === 'Guest cart merged successfully') {
        localStorage.removeItem('sessionId')
        toast.success('Your cart items were saved to your account')
      }
    } catch {
      clearSessionHeader()
    }
    await get().getCartItems()
  },

  reset: () => set({ cart: [], coupon: null, isCouponApplied: false, total: 0, subtotal: 0, shippingAddress: null })
}))

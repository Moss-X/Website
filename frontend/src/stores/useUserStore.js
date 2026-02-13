import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true })

    if (password !== confirmPassword) {
      set({ loading: false })
      return toast.error('Passwords do not match')
    }

    try {
      const res = await axios.post('/auth/signup', { name, email, password })
      set({ user: res.data, loading: false })
      // Merge guest cart after signup
      await get().mergeGuestCart()
      // Refresh cart items to reflect merged state
      try {
        const { useCartStore } = await import('./useCartStore')
        await useCartStore.getState().getCartItems()
      } catch {
        /* noop */
      }
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  },
  login: async (email, password) => {
    set({ loading: true })

    try {
      const res = await axios.post('/auth/login', { email, password })

      set({ user: res.data, loading: false })
      // Merge guest cart after login
      await get().mergeGuestCart()
      // Refresh cart items to reflect merged state
      try {
        const { useCartStore } = await import('./useCartStore')
        await useCartStore.getState().getCartItems()
      } catch {
        /* noop */
      }
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      set({ user: null })
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true })
    try {
      const response = await axios.get('/auth/profile')
      set({ user: response.data, checkingAuth: false })
    } catch (error) {
      set({ checkingAuth: false, user: null })
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    set({ checkingAuth: true })
    try {
      const response = await axios.post('/auth/refresh-token')
      set({ checkingAuth: false })
      return response.data
    } catch (error) {
      set({ user: null, checkingAuth: false })
      throw error
    }
  },

  // Merge guest cart with user cart after login
  mergeGuestCart: async () => {
    try {
      const { useCartStore } = await import('./useCartStore')
      await useCartStore.getState().mergeGuestCart()
    } catch (error) {
      console.error('Error merging guest cart:', error)
    }
  }
}))

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry for these specific auth routes
      const isAuthRoute =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/signup') ||
        originalRequest.url?.includes('/auth/logout') ||
        originalRequest.url?.includes('/auth/refresh-token')

      if (isAuthRoute) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise
          return axios(originalRequest)
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken()
        await refreshPromise
        refreshPromise = null

        return axios(originalRequest)
      } catch (refreshError) {
        refreshPromise = null
        // If refresh fails, clear user state
        useUserStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

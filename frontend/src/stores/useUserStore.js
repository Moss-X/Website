import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from 'react-hot-toast'

const afterSignIn = async () => {
  const { useCartStore } = await import('./useCartStore')
  await useCartStore.getState().mergeGuestCart()
}

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }
    set({ loading: true })
    try {
      const res = await axios.post('/auth/signup', { name, email, password })
      set({ user: res.data, loading: false })
      toast.success(`Welcome to Moss X, ${res.data.name.split(' ')[0]}!`)
      await afterSignIn()
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || 'Could not create your account')
    }
  },
  login: async (email, password) => {
    set({ loading: true })
    try {
      const res = await axios.post('/auth/login', { email, password })
      set({ user: res.data, loading: false })
      await afterSignIn()
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || 'Could not sign you in')
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout')
    } catch {
      /* clear local state regardless */
    }
    set({ user: null })
    const { useCartStore } = await import('./useCartStore')
    useCartStore.getState().reset()
    useCartStore.getState().initializeSession()
  },

  checkAuth: async () => {
    set({ checkingAuth: true })
    try {
      const response = await axios.get('/auth/profile')
      set({ user: response.data, checkingAuth: false })
    } catch {
      set({ checkingAuth: false, user: null })
    }
  },

  // Must not touch `checkingAuth`: App renders a full-screen loader while it is true,
  // which would unmount whatever page the user is on every time the token refreshes.
  refreshToken: async () => {
    const response = await axios.post('/auth/refresh-token')
    return response.data
  }
}))

// Refresh the 15-minute access token once on a 401 and replay the request.
let refreshPromise = null

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }
    const isAuthRoute = ['/auth/login', '/auth/signup', '/auth/logout', '/auth/refresh-token'].some((r) =>
      originalRequest.url?.includes(r)
    )
    if (isAuthRoute) return Promise.reject(error)

    originalRequest._retry = true
    try {
      refreshPromise = refreshPromise || useUserStore.getState().refreshToken()
      await refreshPromise
      refreshPromise = null
      return axios(originalRequest)
    } catch (refreshError) {
      refreshPromise = null
      // Only signed-in sessions need clearing; guests simply have no token.
      if (useUserStore.getState().user) useUserStore.setState({ user: null })
      return Promise.reject(refreshError)
    }
  }
)

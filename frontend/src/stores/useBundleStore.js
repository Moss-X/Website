import { create } from "zustand"
import axios from "../lib/axios"

export const useBundleStore = create((set) => ({
  bundles: [],
  loading: false,
  error: null,
  fetchBundles: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get("/bundles")
      set({ bundles: res.data, loading: false })
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch bundles", loading: false })
    }
  },
  createBundle: async (bundle) => {
    set({ loading: true, error: null })
    try {
      const res = await axios.post("/bundles", bundle)
      set((state) => ({ bundles: [...state.bundles, res.data], loading: false }))
      return { success: true }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to create bundle", loading: false })
      return { success: false, error: error.response?.data?.message || "Failed to create bundle" }
    }
  },
  deleteBundle: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.delete(`/bundles/${id}`)
      set((state) => ({ bundles: state.bundles.filter((b) => b._id !== id), loading: false }))
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to delete bundle", loading: false })
    }
  }
})) 
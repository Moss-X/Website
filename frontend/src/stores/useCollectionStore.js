import { create } from "zustand"
import axios from "../lib/axios"

export const useCollectionStore = create((set) => ({
  collections: [],
  loading: false,
  error: null,
  fetchCollections: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get("/collections")
      set({ collections: res.data, loading: false })
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch collections", loading: false })
    }
  },
  createCollection: async (collection) => {
    set({ loading: true, error: null })
    try {
      const res = await axios.post("/collections", collection)
      set((state) => ({ collections: [...state.collections, res.data], loading: false }))
      return { success: true }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to create collection", loading: false })
      return { success: false, error: error.response?.data?.message || "Failed to create collection" }
    }
  },
  deleteCollection: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.delete(`/collections/${id}`)
      set((state) => ({ collections: state.collections.filter((c) => c._id !== id), loading: false }))
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to delete collection", loading: false })
    }
  }
})) 
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      // Merge guest cart after signup
      await get().mergeGuestCart();
      // Refresh cart items to reflect merged state
      try {
        const { useCartStore } = await import("./useCartStore");
        await useCartStore.getState().getCartItems();
      } catch {
        /* noop */
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });

      set({ user: res.data, loading: false });
      // Merge guest cart after login
      await get().mergeGuestCart();
      // Refresh cart items to reflect merged state
      try {
        const { useCartStore } = await import("./useCartStore");
        await useCartStore.getState().getCartItems();
      } catch {
        /* noop */
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      console.log("in auth check");

      const response = await axios.get("/auth/profile");
      console.log(response);
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log("error check auth ", error);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },

  // Merge guest cart with user cart after login
  mergeGuestCart: async () => {
    try {
      const { useCartStore } = await import("./useCartStore");
      await useCartStore.getState().mergeGuestCart();
    } catch (error) {
      console.error("Error merging guest cart:", error);
    }
  },
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If the failed request is the refresh token request itself, don't retry
        if (originalRequest.url && originalRequest.url.includes("refresh-token")) {
          throw new Error("Refresh token expired");
        }

        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

// Helper function to generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId =
      'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Helper function to set axios headers
const setAxiosHeaders = () => {
  const sessionId = getSessionId();
  axios.defaults.headers.common['x-session-id'] = sessionId;
  return sessionId;
};

// Helper to clear session header (for authenticated user requests)
const clearSessionHeader = () => {
  if (axios.defaults.headers.common['x-session-id']) {
    delete axios.defaults.headers.common['x-session-id'];
  }
};

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  shippingAddress: null,
  loading: false,

  // Initialize session ID for guests only
  initializeSession: async () => {
    try {
      const { useUserStore } = await import('./useUserStore');
      const { user } = useUserStore.getState();
      if (user) {
        clearSessionHeader();
        return;
      }
    } catch {
      /* noop */
    }
    setAxiosHeaders();
  },

  getMyCoupon: async () => {
    try {
      const response = await axios.get('/coupons');
      set({ coupon: response.data });
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post('/coupons/validate', { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success('Coupon applied successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success('Coupon removed');
  },

  getCartItems: async () => {
    console.log('Starting to fetch cart items...');
    set({ loading: true });

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Cart fetch timeout - resetting loading state');
      set({ loading: false });
    }, 10000); // 10 second timeout

    try {
      // If auth check is in progress, wait briefly to avoid fetching as guest right before auth sets the user
      try {
        const { useUserStore } = await import('./useUserStore');
        let { checkingAuth } = useUserStore.getState();
        const start = Date.now();
        while (checkingAuth && Date.now() - start < 1200) {
          await new Promise((r) => setTimeout(r, 60));
          checkingAuth = useUserStore.getState().checkingAuth;
        }
      } catch {
        /* noop */
      }

      // Decide header strategy based on auth state
      let sessionId;
      try {
        const { useUserStore } = await import('./useUserStore');
        const isAuthenticated = Boolean(useUserStore.getState().user);
        if (isAuthenticated) {
          clearSessionHeader();
          console.log('Authenticated fetch: removed x-session-id header');
        } else {
          sessionId = setAxiosHeaders();
          console.log('Session ID set:', sessionId);
        }
      } catch {
        void 0;
      }

      console.log('Making request to /cart...');
      const res = await axios.get('/cart', {
        params: { _ts: Date.now() },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      console.log('Cart response received:', res.data);

      clearTimeout(timeoutId);
      set({ cart: res.data, loading: false });
      get().calculateTotals();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error fetching cart items:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      set({ cart: [], loading: false });
      // Don't show error toast for cart fetch - it's expected for new users
    }
  },
  clearCart: async () => {
    try {
      // Clear cart on the server as well to prevent repopulation on next fetch
      await axios.delete('/cart', { data: {} });
    } catch (error) {
      console.error('Failed to clear cart on server', error);
    }
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  addToCart: async (product) => {
    try {
      // Set session headers for guest users
      setAxiosHeaders();
      await axios.post('/cart', { refId: product._id, type: 'product' });
      toast.success('Product added to cart');

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id && item.type === 'product'
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id && item.type === 'product'
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, type: 'product', quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  },
  addBundleToCart: async (bundle) => {
    try {
      // Set session headers for guest users
      setAxiosHeaders();
      await axios.post('/cart', { refId: bundle._id, type: 'bundle' });
      toast.success('Bundle added to cart');
      set((prevState) => {
        const existingBundle = prevState.cart.find(
          (item) => item.type === 'bundle' && item._id === bundle._id
        );
        if (existingBundle) {
          return {
            cart: prevState.cart.map((item) =>
              item.type === 'bundle' && item._id === bundle._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return {
            cart: [
              ...prevState.cart,
              {
                ...bundle,
                type: 'bundle',
                quantity: 1,
              },
            ],
          };
        }
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to add bundle to cart'
      );
    }
  },
  addCollectionToCart: async (collection) => {
    try {
      // Set session headers for guest users
      setAxiosHeaders();
      await axios.post('/cart', { refId: collection._id, type: 'collection' });
      toast.success('Collection added to cart');
      set((prevState) => {
        const existingCollection = prevState.cart.find(
          (item) => item.type === 'collection' && item._id === collection._id
        );
        if (existingCollection) {
          return {
            cart: prevState.cart.map((item) =>
              item.type === 'collection' && item._id === collection._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return {
            cart: [
              ...prevState.cart,
              {
                ...collection,
                type: 'collection',
                quantity: 1,
              },
            ],
          };
        }
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to add collection to cart'
      );
    }
  },
  removeFromCart: async (id, type) => {
    await axios.delete(`/cart`, { data: { refId: id, type } });
    set((prevState) => ({
      cart: prevState.cart.filter(
        (item) => !(item._id === id && item.type === type)
      ),
    }));
    get().calculateTotals();
  },
  updateQuantity: async (id, quantity, type) => {
    if (quantity === 0) {
      get().removeFromCart(id, type);
      return;
    }

    await axios.put(`/cart/${id}`, { refId: id, type, quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === id && item.type === type ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((sum, item) => {
      if (item.type === 'collection')
        return sum + (item.totalPrice || 0) * item.quantity;
      if (item.type === 'bundle')
        return sum + (item.discountedPrice || 0) * item.quantity;
      return sum + (item.price || 0) * item.quantity;
    }, 0);
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },

  // Set shipping address
  setShippingAddress: (address) => {
    set({ shippingAddress: address });
  },

  // Merge guest cart with user cart after login
  mergeGuestCart: async () => {
    try {
      // Ensure the session header is present so backend can locate the guest cart
      const sessionId = setAxiosHeaders();
      console.log('Merging guest cart with session:', sessionId);
      const response = await axios.post('/cart/merge');
      if (response.data.message === 'Guest cart merged successfully') {
        // After a successful merge, stop sending guest session header so we fetch the user's cart
        clearSessionHeader();
        // Fetch enriched cart items (populated docs) for the authenticated user
        await get().getCartItems();
        toast.success('Guest cart merged successfully');
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
      // Still try to get the latest cart even if merge fails
      await get().getCartItems();
    }
  },
}));

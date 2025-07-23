import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearCart: async () => {
		try {
			// Clear cart on the server as well to prevent repopulation on next fetch
			await axios.delete("/cart", { data: {} });
		} catch (error) {
			console.error("Failed to clear cart on server", error);
		}
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { refId: product._id, type: "product" });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id && item.type === "product");
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id && item.type === "product" ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, type: "product", quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	addBundleToCart: async (bundle) => {
		try {
			await axios.post("/cart", { refId: bundle._id, type: "bundle" });
			toast.success("Bundle added to cart");
			set((prevState) => {
				const existingBundle = prevState.cart.find(
					(item) => item.type === "bundle" && item._id === bundle._id
				);
				if (existingBundle) {
					return {
						cart: prevState.cart.map((item) =>
							item.type === "bundle" && item._id === bundle._id
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
								type: "bundle",
								quantity: 1,
							},
						],
					};
				}
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add bundle to cart");
		}
	},
	addCollectionToCart: async (collection) => {
		try {
			await axios.post("/cart", { refId: collection._id, type: "collection" });
			toast.success("Collection added to cart");
			set((prevState) => {
				const existingCollection = prevState.cart.find(
					(item) => item.type === "collection" && item._id === collection._id
				);
				if (existingCollection) {
					return {
						cart: prevState.cart.map((item) =>
							item.type === "collection" && item._id === collection._id
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
								type: "collection",
								quantity: 1,
							},
						],
					};
				}
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add collection to cart");
		}
	},
	removeFromCart: async (id, type) => {
		await axios.delete(`/cart`, { data: { refId: id, type } });
		set((prevState) => ({
			cart: prevState.cart.filter((item) => !(item._id === id && item.type === type)),
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
			if (item.type === 'collection') return sum + (item.totalPrice || 0) * item.quantity
			if (item.type === 'bundle') return sum + (item.discountedPrice || 0) * item.quantity
			return sum + (item.price || 0) * item.quantity
		}, 0)
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));

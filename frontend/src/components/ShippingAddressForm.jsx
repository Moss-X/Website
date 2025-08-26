import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ShippingAddressForm = ({ onAddressSubmit, isCheckout = false }) => {
	const { user } = useUserStore();
	const { shippingAddress, setShippingAddress } = useCartStore();
	
	const [formData, setFormData] = useState({
		fullName: "",
		phone: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		postalCode: "",
		country: "India",
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (user?.defaultAddress) {
			setFormData(user.defaultAddress);
			setShippingAddress(user.defaultAddress);
		} else if (shippingAddress) {
			setFormData(shippingAddress);
		}
	}, [user, shippingAddress, setShippingAddress]);

	const validateForm = () => {
		const newErrors = {};
		
		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}
		
		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}
		
		if (!formData.addressLine1.trim()) {
			newErrors.addressLine1 = "Address line 1 is required";
		}
		
		if (!formData.city.trim()) {
			newErrors.city = "City is required";
		}
		
		if (!formData.state.trim()) {
			newErrors.state = "State is required";
		}
		
		if (!formData.postalCode.trim()) {
			newErrors.postalCode = "Postal code is required";
		} else if (!/^[0-9]{6}$/.test(formData.postalCode)) {
			newErrors.postalCode = "Please enter a valid 6-digit postal code";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (validateForm()) {
			setShippingAddress(formData);
			if (onAddressSubmit) {
				onAddressSubmit(formData);
			}
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
	};

	return (
		<motion.div
			className="bg-gray-800 rounded-lg p-6 shadow-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h3 className="text-xl font-semibold text-emerald-400 mb-6">
				{isCheckout ? "Shipping Address" : "Delivery Address"}
			</h3>
			
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
							Full Name *
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={formData.fullName}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
								errors.fullName ? 'border-red-500' : 'border-gray-600'
							}`}
							placeholder="Enter your full name"
						/>
						{errors.fullName && (
							<p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
						)}
					</div>

					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
							Phone Number *
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
								errors.phone ? 'border-red-500' : 'border-gray-600'
							}`}
							placeholder="Enter 10-digit phone number"
						/>
						{errors.phone && (
							<p className="text-red-400 text-sm mt-1">{errors.phone}</p>
						)}
					</div>
				</div>

				<div>
					<label htmlFor="addressLine1" className="block text-sm font-medium text-gray-300 mb-1">
						Address Line 1 *
					</label>
					<input
						type="text"
						id="addressLine1"
						name="addressLine1"
						value={formData.addressLine1}
						onChange={handleInputChange}
						className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
							errors.addressLine1 ? 'border-red-500' : 'border-gray-600'
						}`}
						placeholder="Street address, apartment, suite, etc."
					/>
					{errors.addressLine1 && (
						<p className="text-red-400 text-sm mt-1">{errors.addressLine1}</p>
					)}
				</div>

				<div>
					<label htmlFor="addressLine2" className="block text-sm font-medium text-gray-300 mb-1">
						Address Line 2 (Optional)
					</label>
					<input
						type="text"
						id="addressLine2"
						name="addressLine2"
						value={formData.addressLine2}
						onChange={handleInputChange}
						className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						placeholder="Apartment, suite, unit, etc. (optional)"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
							City *
						</label>
						<input
							type="text"
							id="city"
							name="city"
							value={formData.city}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
								errors.city ? 'border-red-500' : 'border-gray-600'
							}`}
							placeholder="Enter city"
						/>
						{errors.city && (
							<p className="text-red-400 text-sm mt-1">{errors.city}</p>
						)}
					</div>

					<div>
						<label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
							State *
						</label>
						<input
							type="text"
							id="state"
							name="state"
							value={formData.state}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
								errors.state ? 'border-red-500' : 'border-gray-600'
							}`}
							placeholder="Enter state"
						/>
						{errors.state && (
							<p className="text-red-400 text-sm mt-1">{errors.state}</p>
						)}
					</div>

					<div>
						<label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
							Postal Code *
						</label>
						<input
							type="text"
							id="postalCode"
							name="postalCode"
							value={formData.postalCode}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
								errors.postalCode ? 'border-red-500' : 'border-gray-600'
							}`}
							placeholder="Enter 6-digit postal code"
						/>
						{errors.postalCode && (
							<p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>
						)}
					</div>
				</div>

				<div>
					<label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
						Country
					</label>
					<select
						id="country"
						name="country"
						value={formData.country}
						onChange={handleInputChange}
						className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
					>
						<option value="India">India</option>
					</select>
				</div>

				<div className="pt-4">
					<button
						type="submit"
						className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
					>
						{isCheckout ? "Continue to Payment" : "Save Address"}
					</button>
				</div>
			</form>
		</motion.div>
	);
};

export default ShippingAddressForm; 
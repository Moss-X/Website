import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	if (item.type === "bundle") {
		return (
			<div className="rounded-lg border p-4 shadow-xs border-emerald-700 bg-gray-800 md:p-6">
				<div className="flex flex-col md:flex-row md:items-center md:gap-6">
					<div className="shrink-0 mb-4 md:mb-0">
						<img className="h-24 w-24 md:h-32 md:w-32 rounded-sm object-cover" src={item.image} alt={item.title} />
					</div>
					<div className="flex-1 min-w-0 space-y-2">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-base font-bold text-emerald-400">{item.title}</span>
							<span className="bg-emerald-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-2">Bundle</span>
						</div>
						<p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
						<div className="flex flex-wrap gap-2 items-center mb-2">
							{item.products?.slice(0, 4).map((p) => (
								<div key={p._id} className="flex items-center gap-1 bg-gray-900 rounded-sm px-2 py-1 text-xs">
									{p.image && <img src={p.image} alt={p.name} className="w-5 h-5 object-cover rounded-sm" />}
									<span className="text-gray-200 max-w-16 truncate">{p.name}</span>
								</div>
							))}
							{item.products?.length > 4 && (
								<span className="text-gray-400 text-xs">+{item.products.length - 4} more</span>
							)}
						</div>
						<div className="flex items-center gap-4 mt-2">
							<div className="flex items-center gap-2">
								<button
									className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
									onClick={() => updateQuantity(item._id, item.quantity - 1, item.type)}
								>
									<Minus className="text-gray-300" />
								</button>
								<p>{item.quantity}</p>
								<button
									className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
									onClick={() => updateQuantity(item._id, item.quantity + 1, item.type)}
								>
									<Plus className="text-gray-300" />
								</button>
							</div>
							<div className="text-end md:w-32">
								<p className="text-base font-bold text-emerald-400">₹{item.discountedPrice || item.price}</p>
							</div>
							<button
								className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline ml-auto"
								onClick={() => removeFromCart(item._id, item.type)}
							>
								<Trash />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (item.type === "collection") {
		return (
			<div className="rounded-lg border p-4 shadow-xs border-emerald-700 bg-gray-800 md:p-6">
				<div className="flex flex-col md:flex-row md:items-center md:gap-6">
					<div className="shrink-0 mb-4 md:mb-0">
						<img className="h-24 w-24 md:h-32 md:w-32 rounded-sm object-cover" src={item.image} alt={item.title} />
					</div>
					<div className="flex-1 min-w-0 space-y-2">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-base font-bold text-emerald-400">{item.title}</span>
							<span className="bg-emerald-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-2">Collection</span>
						</div>
						<p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
						<div className="flex flex-wrap gap-2 items-center mb-2">
							{item.products?.slice(0, 4).map((p) => (
								<div key={p._id} className="flex items-center gap-1 bg-gray-900 rounded-sm px-2 py-1 text-xs">
									{p.image && <img src={p.image} alt={p.name} className="w-5 h-5 object-cover rounded-sm" />}
									<span className="text-gray-200 max-w-16 truncate">{p.name}</span>
								</div>
							))}
							{item.products?.length > 4 && (
								<span className="text-gray-400 text-xs">+{item.products.length - 4} more</span>
							)}
						</div>
						<div className="flex items-center gap-4 mt-2">
							<div className="flex items-center gap-2">
								<button
									className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
									onClick={() => updateQuantity(item._id, item.quantity - 1, item.type)}
								>
									<Minus className="text-gray-300" />
								</button>
								<p>{item.quantity}</p>
								<button
									className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
									onClick={() => updateQuantity(item._id, item.quantity + 1, item.type)}
								>
									<Plus className="text-gray-300" />
								</button>
							</div>
							<div className="text-end md:w-32">
								<p className="text-base font-bold text-emerald-400">₹{item.totalPrice}</p>
							</div>
							<button
								className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline ml-auto"
								onClick={() => removeFromCart(item._id, item.type)}
							>
								<Trash />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Default: product item
	return (
		<div className='rounded-lg border p-4 shadow-xs border-gray-700 bg-gray-800 md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<img className='h-20 md:h-32 rounded-sm object-cover' src={item.image} />
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity - 1, item.type)}
						>
							<Minus className='text-gray-300' />
						</button>
						<p>{item.quantity}</p>
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity + 1, item.type)}
						>
							<Plus className='text-gray-300' />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-emerald-400'>₹{item.price}</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-base font-medium text-white hover:text-emerald-400 hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-gray-400'>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline'
							onClick={() => removeFromCart(item._id, item.type)}
						>
							<Trash />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CartItem;

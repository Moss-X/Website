import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(2);
			else if (window.innerWidth < 1024) setItemsPerPage(3);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prev) =>
			Math.min(prev + itemsPerPage, featuredProducts.length - itemsPerPage)
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	const visibleProducts = featuredProducts.slice(currentIndex, currentIndex + itemsPerPage);

	return (
		<div className=" relative flex flex-col px-4 items-center py-8">
			<div className="mr-auto">
				<h1 className=" text-black text-xl font-sans mb-1">Meet our</h1>
				<h1 className=" text-black font-semibold text-4xl font-sans mb-4">Best Sellers</h1>
			</div>		

			{/* Chevron Left */}
			<button
				onClick={prevSlide}
				disabled={isStartDisabled}
				className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-darkGray text-black p-2 rounded-full shadow-md z-10 disabled:bg-gray disabled:opacity-55 disabled:text-gray-600"
			>
				<ChevronLeft />
			</button>

			{/* Product Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3  gap-4 items-center">
				{visibleProducts.map((product) => (
					<ProductCard product={product} key={product._id} />
				))}
				<div>hello</div>
			</div>

			{/* Chevron Right */}
			<button
				onClick={nextSlide}
				disabled={isEndDisabled}
				className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-darkGray p-2 text-black rounded-full shadow-md z-10 disabled:bg-gray disabled:opacity-55 disabled:text-gray-600	"
			>
				<ChevronRight />
			</button>
			<button className="text-secondary bg-primary rounded-full px-4 py-2 cursor-pointer hover:opacity-95">Show More</button>
		</div>
	);
};

export default FeaturedProducts;

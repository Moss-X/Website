import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import HeroCarousel from "../components/HeroCarousel";
import BundlesPreview from "../components/BundlesPreview";
import CollectionsPreview from "../components/CollectionsPreview";

const categories = [
	{ href: "/ornamental-houseplants", name: "Ornamental Houseplants", imageUrl: "/ornamental-houseplants.jpg" },
	{ href: "/flowering-bedding-plants", name: "Flowering Bedding Plants", imageUrl: "/flowering-bedding-plants.jpg" },
	{ href: "/herbs-and-edible-plants", name: "Herbs and Edible Plants", imageUrl: "/herbs-and-edible-plants.jpg" },
	{ href: "/succulents-and-cacti", name: "Succulents and Cacti", imageUrl: "/succulents-and-cacti.jpg" },
	{ href: "/fruit-trees-and-bushes", name: "Fruit Trees and Bushes", imageUrl: "/fruit-trees-and-bushes.jpg" },
	{ href: "/vegetable-plants-and-seedlings", name: "Vegetable Plants and Seedlings", imageUrl: "/vegetable-plants-and-seedlings.jpg" },
	{ href: "/indoor-air-purifying-plants", name: "Indoor Air-Purifying Plants", imageUrl: "/indoor-air-purifying-plants.jpg" },
];

function HomePage() {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Hero Section */}
        {!isLoading && products.length > 0 && (
          <div className="mb-16">
            <HeroCarousel featuredProducts={products} />
          </div>
        )}
        {/* Bundles Section */}
        <BundlesPreview />
        {/* Collections Section */}
        <CollectionsPreview />
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        {/* Existing Featured Products section moved below categories */}
        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  );
}
export default HomePage;

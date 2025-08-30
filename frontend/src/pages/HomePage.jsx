import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import HeroCarousel from "../components/HeroCarousel";
import BundlesPreview from "../components/BundlesPreview";
import CollectionsPreview from "../components/CollectionsPreview";
import Footer from "../components/Footer";

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
    <div className="relative min-h-screen text-textGreen overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Hero Section */}
        {!isLoading && products.length > 0 && (
          <div>
            <HeroCarousel featuredProducts={products} />
          </div>
        )}
        {/* Existing Featured Products section moved below categories */}
        <section id="best-seller-section">
        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
        </section>
        {/* Bundles Section */}
        <BundlesPreview />
        {/* Collections Section */}
        <CollectionsPreview />
        
      </div>
      <Footer/>
    </div>
  );
}
export default HomePage;

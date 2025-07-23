import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ product, variant = "default" }) {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  if (variant === "mini") {
    return (
      <div
        className="bg-gray-800 rounded-lg shadow p-2 flex flex-col aspect-square w-full hover:ring-2 hover:ring-emerald-400 transition cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label={`View product ${product.name}`}
        onClick={() => navigate(`/product/${product._id}`)}
        onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`) }}
      >
        <div className="bg-gray-900 rounded-lg flex items-center justify-center w-full aspect-square max-h-[70%]">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-lg" />
        </div>
        <div className="w-full mt-2">
          <h3 className="text-base font-bold text-emerald-300 mb-0.5 line-clamp-1 text-left">{product.name}</h3>
          <div className="text-xs text-gray-400 line-clamp-1 text-left mb-1">{product.description}</div>
          <span className="text-emerald-400 font-semibold text-lg text-left block">₹{product.price}</span>
        </div>
      </div>
    )
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to buy products", { id: "login" });
      return;
    } else {
      addToCart(product);
      navigate("/cart");
    }
  };

  return (
    <div
      className="bg-gray-800 rounded-lg p-0 shadow-lg cursor-pointer hover:ring-2 hover:ring-emerald-400 transition transform hover:scale-[1.025] flex flex-col aspect-[4/5]"
      tabIndex={0}
      role="button"
      aria-label={`View product ${product.name}`}
      onClick={() => navigate(`/product/${product._id}`)}
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`) }}
    >
      <div className="relative bg-gray-900 rounded-t-lg flex items-center justify-center w-full aspect-square max-h-[50%]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain rounded-t-lg"
        />
      </div>
      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-xl font-bold text-emerald-300 mb-1 line-clamp-1">{product.name}</h3>
        <div className="text-gray-200 mb-2 line-clamp-2 flex-1 max-h-[3.2em] overflow-hidden">{product.description}</div>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-emerald-400 font-bold text-2xl md:text-3xl">₹{product.price}</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="flex bg-emerald-600 hover:bg-emerald-700 text-white  py-2 px-4 rounded transition-colors text-base"
            onClick={handleAddToCart}
            tabIndex={0}
          >
            <ShoppingCart size={22} className="mr-2" />
            Add to Cart
          </button>
          <button
            className="flex-1 bg-white/10 hover:bg-white/20 text-emerald-400  py-2 px-4 rounded transition-colors text-base"
            onClick={handleBuyNow}
            tabIndex={0}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;

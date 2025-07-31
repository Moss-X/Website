import toast from "react-hot-toast";
import { ShoppingCart, IndianRupee, Plus } from "lucide-react";
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
        className="bg-gray-800 rounded-lg shadow-sm p-2 flex flex-col aspect-square w-full hover:ring-2 hover:ring-emerald-400 transition cursor-pointer"
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
    className="bg-gray
           p-0 border-none cursor-pointer 
           hover:ring-2 hover:bg-darkGray 
           transition-all duration-200 ease-in-out 
           flex flex-col aspect-square overflow-hidden"


      tabIndex={0}
      role="button"
      aria-label={`View product ${product.name}`}
      onClick={() => navigate(`/product/${product._id}`)}
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`) }}
    >

      <div className="relative bg-grey flex items-center justify-center w-full aspect-[4/3] h-[75%]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        </div>

        <div className="flex flex-row px-4 justify-center h-[25%] items-center">
          <div className="flex flex-col gap-2 items-start ">
            <p className="flex text-black text-xs 2xl:text-lg xl:text-base lg:text-sm md:text-xs sm:text-[10px] font-semibold">{product.name}</p>
            <p className="flex flex-row items-center text-black text-xs 2xl:text-lg xl:text-base lg:text-sm md:text-xs sm:text-[10px]">

                  <IndianRupee size={12} />
                  <span>{product.price}</span>
                </p>

          </div>
          <div onClick={handleAddToCart} 
          className="ml-auto p-1.5 hover:ring-amber-500 bg-black rounded-full">
           <Plus size={24} />
          </div>
        </div>
    </div>
  );
}
export default ProductCard;

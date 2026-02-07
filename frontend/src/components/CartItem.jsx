import { Minus, Plus, Trash } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  // Responsive, consistent styling for all item types
  if (item.type === 'bundle' || item.type === 'collection') {
    return (
      <div className="rounded-lg p-4 md:p-6 shadow-xs bg-gray-100 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <div className="shrink-0 flex items-center justify-center w-full md:w-auto">
          <img
            className="h-20 w-20 md:h-32 md:w-32 rounded-sm object-cover"
            src={item.image}
            alt={item.title}
          />
        </div>
        <div className="flex-1 min-w-0 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-base font-bold text-black">{item.title}</span>
            <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {item.type === 'bundle' ? 'Bundle' : 'Collection'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            {item.products?.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-1 bg-gray-200 rounded-sm px-2 py-1 text-xs"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-5 h-5 object-cover rounded-sm"
                  />
                )}
                <span className="text-black max-w-16 truncate">{p.name}</span>
              </div>
            ))}
            {item.products?.length > 4 && (
              <span className="text-gray-500 text-xs">
                +{item.products.length - 4} more
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-darkGreen bg-primary hover:bg-darkGreen focus:outline-hidden focus:ring-2 focus:ring-darkGreen"
                onClick={() =>
                  updateQuantity(item._id, item.quantity - 1, item.type)
                }
              >
                <Minus className="text-white" />
              </button>
              <p className="text-black font-semibold">{item.quantity}</p>
              <button
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-darkGreen bg-primary hover:bg-darkGreen focus:outline-hidden focus:ring-2 focus:ring-darkGreen"
                onClick={() =>
                  updateQuantity(item._id, item.quantity + 1, item.type)
                }
              >
                <Plus className="text-white" />
              </button>
            </div>
            <div className="text-start md:w-32">
              <p className="text-base font-bold text-black">
                ₹{item.discountedPrice || item.totalPrice || item.price}
              </p>
            </div>
            <button
              className="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400 hover:underline ml-auto"
              onClick={() => removeFromCart(item._id, item.type)}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Product item
  return (
    <div className="rounded-lg p-4 md:p-6 shadow-xs bg-gray-100 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
      <div className="shrink-0 flex items-center justify-start w-full md:w-auto">
        <img
          className="h-20 w-20 md:h-32 md:w-32 rounded-sm object-cover"
          src={item.image}
          alt={item.name}
        />
      </div>
      <div className="flex-1 min-w-0 w-full space-y-2">
        <p className="text-base font-medium text-black hover:text-primary hover:underline">
          {item.name}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-6 w-6 items-center justify-center rounded-full  bg-primary hover:bg-darkGreen focus:outline-hidden hover:ring-2 hover:ring-neutral"
              onClick={() =>
                updateQuantity(item._id, item.quantity - 1, item.type)
              }
            >
              <Minus className="text-white" />
            </button>
            <p className="text-black font-semibold">{item.quantity}</p>
            <button
              className="inline-flex h-6 w-6 items-center justify-center rounded-full  bg-primary hover:bg-darkGreen focus:outline-hidden hover:ring-2 hover:ring-neutral"
              onClick={() =>
                updateQuantity(item._id, item.quantity + 1, item.type)
              }
            >
              <Plus className="text-white" />
            </button>
          </div>
          <div className="text-start md:w-32">
            <p className="text-base font-bold text-black">₹{item.price}</p>
          </div>
          <button
            className="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400 hover:underline ml-auto"
            onClick={() => removeFromCart(item._id, item.type)}
          >
            <Trash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

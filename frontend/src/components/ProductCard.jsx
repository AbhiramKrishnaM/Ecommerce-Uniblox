import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/formatters";

export default function ProductCard({ product }) {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${formatPrice(product.price)}
          </span>
          {isInCart ? (
            <button
              onClick={handleRemoveFromCart}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">Stock: {product.stock}</div>
      </div>
    </div>
  );
}

import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/formatters";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">
            Add some products to your cart to get started!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-4"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${formatPrice(item.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  ${formatPrice(item.price * item.quantity)}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 mt-4"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              /* Implement checkout */
            }}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

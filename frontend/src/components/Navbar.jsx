import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">TechTrove</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {/* <Link to="/products" className="text-gray-600 hover:text-blue-600">
              Products
            </Link>
            <Link to="/deals" className="text-gray-600 hover:text-blue-600">
              Deals
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">
              About
            </Link> */}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Uniblox
          </Link>
          <div className="flex space-x-4">
            <Link to="/products" className="hover:text-gray-600">
              Products
            </Link>
            <Link to="/cart" className="hover:text-gray-600">
              Cart
            </Link>
            <Link to="/login" className="hover:text-gray-600">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

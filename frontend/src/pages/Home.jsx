import { useEffect } from "react";
import { useProducts } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading products: {error}
      </div>
    );
  }

  if (!Array.isArray(products)) {
    return (
      <div className="text-center text-red-500 py-8">No products available</div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to TechTrove
        </h1>
        <p className="mt-2 text-xl text-gray-600">
          Discover Amazing Tech Products
        </p>
      </div>

      {/* Featured Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Laptops", "Smartphones", "Accessories", "Gadgets"].map(
            (category) => (
              <div
                key={category}
                className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <h3 className="font-medium">{category}</h3>
              </div>
            )
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-4">
          Subscribe to our newsletter for the latest products and deals!
        </p>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-l border-2 border-r-0 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button className="px-6 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, useState } from "react";
import { productService } from "../../api";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === "All") return products;

    return products.filter((product) => {
      // Add category-based filtering logic
      switch (selectedCategory) {
        case "Laptops":
          return product.name.toLowerCase().includes("laptop");
        case "Smartphones":
          return (
            product.name.toLowerCase().includes("phone") ||
            product.name.toLowerCase().includes("mobile")
          );
        case "Accessories":
          return (
            product.name.toLowerCase().includes("charger") ||
            product.name.toLowerCase().includes("case") ||
            product.name.toLowerCase().includes("adapter") ||
            product.name.toLowerCase().includes("stand")
          );
        case "Gadgets":
          return (
            product.name.toLowerCase().includes("watch") ||
            product.name.toLowerCase().includes("camera") ||
            product.name.toLowerCase().includes("headset") ||
            product.name.toLowerCase().includes("speaker")
          );
        default:
          return true;
      }
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products: getFilteredProducts(),
        loading,
        error,
        fetchProducts,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);

import { createContext, useContext, useState } from "react";
import { cartService } from "../api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeCart = async (userId = null) => {
    try {
      setLoading(true);
      const newCart = await cartService.createCart(userId);
      setCart(newCart);
      localStorage.setItem("cartId", newCart.id);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.addItem(
        cart.id,
        productId,
        quantity
      );
      setCart(updatedCart);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.updateItemQuantity(
        cart.id,
        productId,
        quantity
      );
      setCart(updatedCart);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        initializeCart,
        addItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

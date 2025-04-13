import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export function useCartWithAuth() {
  const { user } = useAuth();
  const { initializeCart, cart } = useCart();

  useEffect(() => {
    if (!cart) {
      initializeCart(user?.id);
    }
  }, [user, cart]);

  return useCart();
}

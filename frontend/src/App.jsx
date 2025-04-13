import { BrowserRouter } from "react-router-dom";
import {
  AuthProvider,
  CartProvider,
  ProductProvider,
  UIProvider,
} from "./contexts";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <ProductProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </ProductProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

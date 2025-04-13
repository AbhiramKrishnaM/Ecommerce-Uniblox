import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../../api/authentication";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && !storedUser) {
        try {
          const userData = await authService.getProfile();
          setUser(userData.user);
          localStorage.setItem("user", JSON.stringify(userData.user));
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

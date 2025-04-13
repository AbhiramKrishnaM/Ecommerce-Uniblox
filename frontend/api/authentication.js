import axios from "./axios.config";

export const authService = {
  async register(userData) {
    try {
      const response = await axios.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post("/auth/login", credentials);
      const { data } = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  async getProfile() {
    try {
      const response = await axios.get("/auth/profile");
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch profile" };
    }
  },

  async logout() {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

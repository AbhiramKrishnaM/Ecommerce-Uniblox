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
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  async getProfile() {
    const response = await axios.get("/auth/profile");
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};

import axios from "./axios.config";

export const authService = {
  async register(username, password) {
    const response = await axios.post("/auth/register", { username, password });
    return response.data;
  },

  async login(username, password) {
    const response = await axios.post("/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  async getProfile() {
    const response = await axios.get("/auth/profile");
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};

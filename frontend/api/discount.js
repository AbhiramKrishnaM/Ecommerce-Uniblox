import axios from "./axios.config";

export const discountService = {
  async getUserDiscounts() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("/auth/my-discounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required");
      }
      throw (
        error.response?.data || { message: "Failed to fetch discount codes" }
      );
    }
  },
};

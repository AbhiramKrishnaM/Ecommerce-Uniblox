import axios from "./axios.config";

export const orderService = {
  async createOrder(orderData) {
    const token = localStorage.getItem("token");
    const response = await axios.post("/orders", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

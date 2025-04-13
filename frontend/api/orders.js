import axios from "./axios.config";

export const orderService = {
  async createOrder(orderData) {
    const response = await axios.post("/orders", orderData);
    return response.data;
  },
};

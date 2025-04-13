import axios from "./axios.config";

export const productService = {
  async getAllProducts() {
    const response = await axios.get("/products");
    return response.data;
  },
};

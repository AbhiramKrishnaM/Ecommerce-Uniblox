import axios from "./axios.config";

export const cartService = {
  async createCart(userId = null) {
    const response = await axios.post("/carts", { userId });
    return response.data;
  },

  async addItem(cartId, productId, quantity) {
    const response = await axios.post(`/carts/${cartId}/items`, {
      productId,
      quantity,
    });
    return response.data;
  },

  async updateItemQuantity(cartId, productId, quantity) {
    const response = await axios.patch(`/carts/${cartId}/items/${productId}`, {
      quantity,
    });
    return response.data;
  },

  async checkout(cartId, checkoutData) {
    const response = await axios.post(
      `/carts/${cartId}/checkout`,
      checkoutData
    );
    return response.data;
  },
};

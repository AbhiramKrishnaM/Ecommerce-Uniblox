import axios from "./axios.config";

export const adminService = {
  async createDiscountCode(discountData) {
    const response = await axios.post("/admin/discount-codes", discountData);
    return response.data;
  },
};

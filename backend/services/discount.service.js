import prisma from "../lib/prisma.js";

export class DiscountService {
  static async generateDiscountCode(orderCount) {
    if (orderCount % 5 === 0) {
      // Generate discount for every 5th order
      const code = `ORDER${orderCount}`;
      return prisma.discountCode.create({
        data: {
          code,
          discountType: "PERCENTAGE",
          discountValue: 10.0,
          maxUses: 1,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
        },
      });
    }
    return null;
  }
}

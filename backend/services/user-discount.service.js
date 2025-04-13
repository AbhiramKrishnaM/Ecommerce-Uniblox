import prisma from "../lib/prisma.js";

export class UserDiscountService {
  static async checkAndGenerateDiscount(userId) {
    try {
      // Count completed orders
      const orderCount = await prisma.order.count({
        where: {
          userId,
          status: "DELIVERED",
        },
      });

      // Check if user qualifies for a new discount
      if (orderCount >= 5) {
        // Check if user already has an unused discount
        const existingDiscount = await prisma.userDiscountCode.findFirst({
          where: {
            userId,
            isUsed: false,
            expiresAt: { gt: new Date() },
          },
        });

        if (!existingDiscount) {
          // Generate new discount code
          const code = `LOYAL${userId.slice(0, 6)}${Date.now()}`;
          const discountCode = await prisma.discountCode.create({
            data: {
              code,
              discountType: "PERCENTAGE",
              discountValue: 15.0,
              maxUses: 1,
              isActive: true,
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
          });

          // Link discount to user
          await prisma.userDiscountCode.create({
            data: {
              userId,
              code: discountCode.code,
              expiresAt: discountCode.endDate,
            },
          });

          return discountCode;
        }
      }
      return null;
    } catch (error) {
      console.error("Error generating user discount:", error);
      throw error;
    }
  }

  static async markDiscountAsUsed(userId, code) {
    return prisma.userDiscountCode.updateMany({
      where: {
        userId,
        code,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });
  }
}

import prisma from "../lib/prisma.js";

export class DiscountService {
  static async generateDiscountCode(userId) {
    try {
      // Count user's orders
      const orderCount = await prisma.order.count({
        where: { userId },
      });

      // Check if it's the 5th order
      if ((orderCount + 1) % 5 === 0) {
        const code = `LOYAL${userId.slice(0, 6)}${orderCount + 1}`;
        const discountCode = await prisma.discountCode.create({
          data: {
            code,
            discountType: "PERCENTAGE",
            discountValue: 15.0, // 15% off for loyalty
            maxUses: 1,
            isActive: true,
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
          },
        });

        // Notify user (you can implement email notification here)
        console.log(`Loyalty discount generated for user: ${code}`);
        return discountCode;
      }

      return null;
    } catch (error) {
      console.error("Error generating discount code:", error);
      return null;
    }
  }
}

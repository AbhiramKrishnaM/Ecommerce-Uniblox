import prisma from "../lib/prisma.js";

export class OrderService {
  static async calculateTotal(items) {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  }

  static async applyDiscount(totalAmount, discountCode) {
    if (!discountCode) return { totalAmount, discountCodeRecord: null };

    const discountCodeRecord = await prisma.discountCode.findFirst({
      where: {
        code: discountCode,
        isActive: true,
        OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
        AND: [
          { maxUses: null },
          { currentUses: { lt: prisma.discountCode.fields.maxUses } },
        ],
      },
    });

    if (!discountCodeRecord) return { totalAmount, discountCodeRecord: null };

    const discount =
      discountCodeRecord.discountType === "PERCENTAGE"
        ? totalAmount * (discountCodeRecord.discountValue / 100)
        : discountCodeRecord.discountValue;

    return {
      totalAmount: totalAmount - discount,
      discountCodeRecord,
    };
  }

  static async createOrderFromCart(cartData) {
    const { userId, cart, totalAmount, discountCodeRecord, ...orderDetails } =
      cartData;

    return prisma.order.create({
      data: {
        userId,
        totalAmount,
        discountCodeId: discountCodeRecord?.id,
        ...orderDetails,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: {
        items: true,
        discountCode: true,
      },
    });
  }
}

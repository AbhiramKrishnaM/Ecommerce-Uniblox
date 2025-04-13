import prisma from "../lib/prisma.js";

export class PrismaService {
  // Product operations
  static async getProducts() {
    return prisma.product.findMany();
  }

  static async getProduct(id) {
    return prisma.product.findUnique({ where: { id } });
  }

  // Cart operations
  static async getCart(cartId) {
    return prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async addToCart(cartId, productId, quantity) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  // Order operations
  static async createOrder(data) {
    return prisma.order.create({
      data: {
        ...data,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
        discountCode: true,
      },
    });
  }

  // Discount operations
  static async validateDiscountCode(code) {
    return prisma.discountCode.findFirst({
      where: {
        code,
        isActive: true,
        OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
        AND: [
          { maxUses: null },
          { currentUses: { lt: prisma.discountCode.fields.maxUses } },
        ],
      },
    });
  }
}

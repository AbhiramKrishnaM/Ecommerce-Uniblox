import prisma from "../lib/prisma.js";

export class CartService {
  static async validateCart(cartId, userId) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (cart.userId && cart.userId !== userId) {
      throw new Error("Unauthorized access to cart");
    }

    if (!cart.items.length) {
      throw new Error("Cart is empty");
    }

    return cart;
  }

  static async clearCart(cartId) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

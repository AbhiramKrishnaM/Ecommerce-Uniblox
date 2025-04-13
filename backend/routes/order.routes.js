import express from "express";
import { PrismaService } from "../services/prisma.service.js";
import { AuthService } from "../services/auth.service.js";

const router = express.Router();

// Create order (checkout)
router.post("/", async (req, res) => {
  try {
    const { cartId, discountCode, username, password, ...orderData } = req.body;
    let userId = req.user?.userId; // From JWT token if logged in

    // Handle account creation during checkout
    if (!userId && username && password) {
      const newUser = await AuthService.register(username, password);
      userId = newUser.id;
    }

    // Get cart items
    const cart = await PrismaService.getCart(cartId);
    if (!cart || !cart.items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total amount
    let totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    // Apply discount if provided
    let discountCodeRecord = null;
    if (discountCode) {
      discountCodeRecord = await PrismaService.validateDiscountCode(
        discountCode
      );
      if (discountCodeRecord) {
        const discount =
          discountCodeRecord.discountType === "PERCENTAGE"
            ? totalAmount * (discountCodeRecord.discountValue / 100)
            : discountCodeRecord.discountValue;
        totalAmount -= discount;
      }
    }

    // Create order
    const order = await PrismaService.createOrder({
      ...orderData,
      userId,
      totalAmount,
      discountCodeId: discountCodeRecord?.id,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId } });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

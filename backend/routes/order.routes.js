import express from "express";
import { PrismaService } from "../services/prisma.service.js";
import { AuthService } from "../services/auth.service.js";
import { ResponseUtil } from "../utils/response.util.js";

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
      return res.status(400).json(ResponseUtil.error("Cart is empty", 400));
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

    res
      .status(201)
      .json(ResponseUtil.created(order, "Order created successfully"));
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

export default router;

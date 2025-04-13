import express from "express";
import { PrismaService } from "../services/prisma.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { CartService } from "../services/cart.service.js";
import { OrderService } from "../services/order.service.js";
import { ResponseUtil } from "../utils/response.util.js";

const router = express.Router();

// Add to cart
router.post("/:cartId/items", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const cartItem = await PrismaService.addToCart(cartId, productId, quantity);
    res.json(ResponseUtil.success(cartItem, "Item added to cart"));
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

// Remove from cart
router.delete("/:cartId/items/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    await prisma.cartItem.delete({
      where: {
        cartId_productId: { cartId, productId },
      },
    });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart quantity
router.patch("/:cartId/items/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    const cartItem = await prisma.cartItem.update({
      where: {
        cartId_productId: { cartId, productId },
      },
      data: { quantity },
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout route
router.post("/:cartId/checkout", authenticateToken, async (req, res) => {
  try {
    const { cartId } = req.params;
    const {
      discountCode,
      shippingAddress,
      billingAddress,
      contactEmail,
      contactPhone,
    } = req.body;
    const userId = req.user.userId;

    // Validate cart and get items
    const cart = await CartService.validateCart(cartId, userId);

    // Calculate initial total
    let totalAmount = await OrderService.calculateTotal(cart.items);

    // Apply discount if provided
    const { totalAmount: finalAmount, discountCodeRecord } =
      await OrderService.applyDiscount(totalAmount, discountCode);

    // Create order
    const order = await OrderService.createOrderFromCart({
      userId,
      cart,
      totalAmount: finalAmount,
      discountCodeRecord,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      contactEmail,
      contactPhone,
    });

    // Clear cart
    await CartService.clearCart(cartId);

    res.json(
      ResponseUtil.success({ order }, "Checkout completed successfully")
    );
  } catch (error) {
    const status =
      {
        "Cart not found": 404,
        "Unauthorized access to cart": 403,
        "Cart is empty": 400,
      }[error.message] || 500;

    res.status(status).json(ResponseUtil.error(error.message, status));
  }
});

export default router;

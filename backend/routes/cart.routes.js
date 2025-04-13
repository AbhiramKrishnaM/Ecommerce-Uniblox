import express from "express";
import { PrismaService } from "../services/prisma.service.js";

const router = express.Router();

// Add to cart
router.post("/:cartId/items", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const cartItem = await PrismaService.addToCart(cartId, productId, quantity);
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export default router;

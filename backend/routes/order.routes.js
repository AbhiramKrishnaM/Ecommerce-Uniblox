import express from "express";
import { PrismaService } from "../services/prisma.service.js";
import { ResponseUtil } from "../utils/response.util.js";

const router = express.Router();

// Create order (checkout)
router.post("/", async (req, res) => {
  try {
    const {
      discountCode,
      username,
      password,
      shippingAddress,
      billingAddress,
      contactEmail,
      contactPhone,
      totalAmount,
      items,
    } = req.body;

    let userId = req.user?.userId; // From JWT token if logged in

    // Apply discount if provided
    let discountCodeRecord = null;
    if (discountCode) {
      discountCodeRecord = await PrismaService.validateDiscountCode(
        discountCode
      );
    }

    // Create order with stringified addresses
    const order = await PrismaService.createOrder({
      userId,
      totalAmount,
      discountCodeId: discountCodeRecord?.id,
      shippingAddress: JSON.stringify(shippingAddress), // Convert object to string
      billingAddress: JSON.stringify(billingAddress), // Convert object to string
      contactEmail,
      contactPhone,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    });

    res
      .status(201)
      .json(ResponseUtil.created(order, "Order created successfully"));
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

export default router;

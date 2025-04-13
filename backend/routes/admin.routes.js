import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// Generate discount code
router.post("/discount-codes", async (req, res) => {
  try {
    const { code, discountType, discountValue, maxUses, endDate } = req.body;
    const discountCode = await prisma.discountCode.create({
      data: {
        code,
        discountType,
        discountValue,
        maxUses,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    res.json(discountCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order statistics
router.get("/statistics", async (req, res) => {
  try {
    const [totalOrders, totalAmount, totalDiscounts] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: { discountCodeId: { not: null } },
      }),
    ]);

    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
      include: {
        product: true,
      },
    });

    res.json({
      totalOrders,
      totalAmount: totalAmount._sum.totalAmount,
      totalDiscounts,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

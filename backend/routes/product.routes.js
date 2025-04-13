import express from "express";
import { PrismaService } from "../services/prisma.service.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await PrismaService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

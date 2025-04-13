import express from "express";
import { PrismaService } from "../services/prisma.service.js";
import { ResponseUtil } from "../utils/response.util.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await PrismaService.getProducts();
    res.json(ResponseUtil.success(products, "Products retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

export default router;

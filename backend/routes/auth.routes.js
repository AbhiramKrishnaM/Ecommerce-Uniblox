import express from "express";
import { AuthService } from "../services/auth.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { ResponseUtil } from "../utils/response.util.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, welcomeDiscount } = await AuthService.register(
      username,
      password
    );

    res
      .status(201)
      .json(
        ResponseUtil.created(
          { user, welcomeDiscount },
          "User registered successfully! Check your welcome discount code"
        )
      );
  } catch (error) {
    res.status(400).json(ResponseUtil.error(error.message, 400));
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await AuthService.login(username, password);
    res.json(ResponseUtil.success({ user, token }, "Login successful"));
  } catch (error) {
    res.status(401).json(ResponseUtil.error(error.message, 401));
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(ResponseUtil.error("Authentication required", 401));
    }

    await AuthService.blacklistToken(token);
    res.json(ResponseUtil.success(null, "Logged out successfully"));
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, role: true },
    });
    res.json(ResponseUtil.success(user, "Profile retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

// Get user's available discount codes
router.get("/my-discounts", authenticateToken, async (req, res) => {
  try {
    const discounts = await prisma.userDiscountCode.findMany({
      where: {
        userId: req.user.userId,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        discount: true,
      },
    });

    res.json(
      ResponseUtil.success(
        discounts.map((d) => ({
          code: d.code,
          discountValue: d.discount.discountValue,
          discountType: d.discount.discountType,
          expiresAt: d.expiresAt,
        })),
        "Available discount codes retrieved successfully"
      )
    );
  } catch (error) {
    res.status(500).json(ResponseUtil.error(error.message));
  }
});

export default router;

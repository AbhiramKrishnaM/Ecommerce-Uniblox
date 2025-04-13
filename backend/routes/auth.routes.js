import express from "express";
import { AuthService } from "../services/auth.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { ResponseUtil } from "../utils/response.util.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.register(username, password);
    res
      .status(201)
      .json(ResponseUtil.created(user, "User registered successfully"));
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

export default router;

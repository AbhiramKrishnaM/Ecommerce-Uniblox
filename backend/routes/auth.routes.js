import express from "express";
import { AuthService } from "../services/auth.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.register(username, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await AuthService.login(username, password);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, role: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

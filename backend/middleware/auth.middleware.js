import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.service.js";
import { ResponseUtil } from "../utils/response.util.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // Check if token is blacklisted
    if (await AuthService.isTokenBlacklisted(token)) {
      return res
        .status(401)
        .json(ResponseUtil.error("Token has been invalidated", 401));
    }

    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

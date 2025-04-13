import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "hehohahahmeha";

export class AuthService {
  static async register(username, password) {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "USER",
      },
    });
  }

  static async login(username, password) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return { user, token };
  }

  static async blacklistToken(token) {
    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  static async isTokenBlacklisted(token) {
    const blacklistedToken = await prisma.blacklistedToken.findUnique({
      where: { token },
    });
    return !!blacklistedToken;
  }
}

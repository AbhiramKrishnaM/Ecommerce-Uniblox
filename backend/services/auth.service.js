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
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "USER",
      },
    });

    const welcomeCode = `WELCOME${user.id.slice(0, 6)}`;
    const discountCode = await prisma.discountCode.create({
      data: {
        code: welcomeCode,
        discountType: "PERCENTAGE",
        discountValue: 50.0,
        maxUses: 1,
        isActive: true,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.userDiscountCode.create({
      data: {
        userId: user.id,
        code: welcomeCode,
        expiresAt: discountCode.endDate,
      },
    });

    return {
      user,
      welcomeDiscount: {
        code: welcomeCode,
        discountValue: 50,
        expiresAt: discountCode.endDate,
      },
    };
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
    try {
      return await prisma.blacklistedToken.create({
        data: {
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
    } catch (error) {
      console.error("Error blacklisting token:", error);
      throw new Error("Failed to blacklist token");
    }
  }

  static async isTokenBlacklisted(token) {
    try {
      const blacklistedToken = await prisma.blacklistedToken.findUnique({
        where: { token },
      });
      return !!blacklistedToken;
    } catch (error) {
      console.error("Error checking blacklisted token:", error);
      return false;
    }
  }
}

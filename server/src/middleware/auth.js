import { jwt } from "hono/jwt";
import User from "../models/User.js";

export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  cookie: "auth_token",
});

export const requireAuth = async (c, next) => {
  try {
    const payload = c.get("jwtPayload");
    const user = await User.findById(payload.userId);

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 401);
    }

    c.set("user", user);
    await next();
  } catch (error) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }
};

export const adminMiddleware = async (c, next) => {
  try {
    const user = c.get("user");
    if (!user.isAdmin) {
      return c.json({ success: false, error: "Admin access required" }, 403);
    }
    await next();
  } catch (error) {
    return c.json({ success: false, error: "Admin access required" }, 403);
  }
};

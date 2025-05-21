import { Hono } from "hono";
import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";
import User from "../models/User.js";
import { OTP } from "../models/OTP.js";
import { sendOTPEmail } from "../services/emailService.js";
import { authMiddleware, requireAuth } from "../middleware/auth.js";

export const auth = new Hono();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const setJWTCookie = async (c, token) => {
  const signedToken = await token;
  setCookie(c, "auth_token", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
};

auth.post("/register/send-otp", async (c) => {
  try {
    const { email } = await c.req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: "کاربری با این ایمیل وجود دارد" }, 400);
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({
      email,
      otp,
      type: "REGISTRATION",
      expiresAt,
    });

    await sendOTPEmail(email, otp, "REGISTRATION");

    return c.json({ message: "OTP sent successfully" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post("/register/verify-otp", async (c) => {
  try {
    const { email, otp, password, name, username } = await c.req.json();

    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "REGISTRATION",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return c.json({ error: "کد تایید اشتباه است" }, 400);
    }

    const user = await User.create({
      email,
      password,
      name,
      username,
      isVerified: true,
    });

    otpRecord.isUsed = true;
    await otpRecord.save();

    const token = sign(
      {
        userId: user._id,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      },
      process.env.JWT_SECRET,
      "HS256"
    );

    await setJWTCookie(c, token);

    return c.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: "ایمیل یا رمز عبور اشتباه است" }, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return c.json({ error: "ایمیل یا رمز عبور اشتباه است" }, 401);
    }

    const token = sign(
      {
        userId: user._id,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      },
      process.env.JWT_SECRET,
      "HS256"
    );

    await setJWTCookie(c, token);

    return c.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post("/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
      email,
      otp,
      type: "PASSWORD_RESET",
      expiresAt,
    });

    await sendOTPEmail(email, otp, "PASSWORD_RESET");

    return c.json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post("/reset-password", async (c) => {
  try {
    const { email, otp, newPassword } = await c.req.json();

    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "PASSWORD_RESET",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return c.json({ error: "کد تایید اشتباه است" }, 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    user.password = newPassword;
    await user.save();

    otpRecord.isUsed = true;
    await otpRecord.save();

    return c.json({ message: "Password reset successful" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.get("/profile", authMiddleware, requireAuth, async (c) => {
  try {
    const user = c.get("user");
    return c.json({
      id: user._id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      username: user.username,
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post("/logout", async (c) => {
  deleteCookie(c, "auth_token", {
    path: "/",
  });

  return c.json({ message: "Logged out successfully" });
});

export default auth;

import { Hono } from "hono";
import User from "../models/User.js";
import Poll from "../models/Poll.js";
import {
  authMiddleware,
  requireAuth,
  adminMiddleware,
} from "../middleware/auth.js";

export const admin = new Hono();

// Middleware برای اطمینان از اینکه کاربر admin است
admin.use("*", authMiddleware, requireAuth, adminMiddleware);

// دریافت لیست کاربران
admin.get("/users", async (c) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return c.json(users);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// دریافت اطلاعات یک کاربر خاص
admin.get("/users/:id", async (c) => {
  try {
    const user = await User.findById(c.req.param("id"), { password: 0 });
    if (!user) {
      return c.json({ error: "کاربر یافت نشد" }, 404);
    }
    return c.json(user);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ویرایش اطلاعات کاربر
admin.patch("/users/:id", async (c) => {
  try {
    const { name, email, isVerified, isAdmin } = await c.req.json();
    const user = await User.findById(c.req.param("id"));

    if (!user) {
      return c.json({ error: "کاربر یافت نشد" }, 404);
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof isVerified === "boolean") user.isVerified = isVerified;
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;

    await user.save();
    return c.json({ message: "اطلاعات کاربر با موفقیت بروزرسانی شد" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// حذف کاربر
admin.delete("/users/:id", async (c) => {
  try {
    const user = await User.findById(c.req.param("id"));
    if (!user) {
      return c.json({ error: "کاربر یافت نشد" }, 404);
    }

    await user.deleteOne();
    return c.json({ message: "کاربر با موفقیت حذف شد" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// دریافت لیست نظرسنجی‌ها
admin.get("/polls", async (c) => {
  try {
    const polls = await Poll.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return c.json(polls);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// دریافت اطلاعات یک نظرسنجی خاص
admin.get("/polls/:id", async (c) => {
  try {
    const poll = await Poll.findById(c.req.param("id")).populate(
      "createdBy",
      "name email"
    );
    if (!poll) {
      return c.json({ error: "نظرسنجی یافت نشد" }, 404);
    }
    return c.json(poll);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ویرایش نظرسنجی
admin.patch("/polls/:id", async (c) => {
  try {
    const { title, description, endDate, isActive } = await c.req.json();
    const poll = await Poll.findById(c.req.param("id"));

    if (!poll) {
      return c.json({ error: "نظرسنجی یافت نشد" }, 404);
    }

    if (title) poll.title = title;
    if (description) poll.description = description;
    if (endDate) poll.endDate = endDate;
    if (typeof isActive === "boolean") poll.isActive = isActive;

    await poll.save();
    return c.json({ message: "نظرسنجی با موفقیت بروزرسانی شد" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// حذف نظرسنجی
admin.delete("/polls/:id", async (c) => {
  try {
    const poll = await Poll.findById(c.req.param("id"));
    if (!poll) {
      return c.json({ error: "نظرسنجی یافت نشد" }, 404);
    }

    await poll.deleteOne();
    return c.json({ message: "نظرسنجی با موفقیت حذف شد" });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// آمار کلی
admin.get("/stats", async (c) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPolls = await Poll.countDocuments();
    const activePolls = await Poll.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    return c.json({
      totalUsers,
      totalPolls,
      activePolls,
      verifiedUsers,
      adminUsers,
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default admin;

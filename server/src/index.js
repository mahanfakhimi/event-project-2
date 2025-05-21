import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import mongoose from "mongoose";
import pollRouter from "./routes/pollRoutes.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";

// Create Hono app
const app = new Hono();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use("*", cors({ origin: "http://localhost:5173", credentials: true }));

// Routes
app.route("/api/polls", pollRouter);
app.route("/api/auth", authRouter);
app.route("/api/admin", adminRouter);

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, error: "Internal server error" }, 500);
});

// Start server
const port = process.env.PORT || 3000;
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server running on port ${info.port}`);
  }
);

// Update poll status every hour
setInterval(async () => {
  try {
    const response = await fetch(
      `http://localhost:${port}/api/polls/update-status`
    );
    if (!response.ok) {
      console.error("Failed to update poll status");
    }
  } catch (error) {
    console.error("Error updating poll status:", error);
  }
}, 60 * 60 * 1000);

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { handleDemo } from "./routes/demo";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetUser,
  handleUpdateUser,
} from "./routes/auth";
import {
  handleCreateBooking,
  handleGetUserBookings,
  handleGetBooking,
  handleCancelBooking,
} from "./routes/bookings";

export function createServer() {
  const app = express();

  // Connect to MongoDB
  connectDB().catch((err) =>
    console.error("Failed to connect to MongoDB:", err),
  );

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/user", handleGetUser);
  app.put("/api/auth/user", handleUpdateUser);

  // Booking routes
  app.post("/api/bookings", handleCreateBooking);
  app.get("/api/bookings", handleGetUserBookings);
  app.get("/api/bookings/:bookingId", handleGetBooking);
  app.delete("/api/bookings/:bookingId", handleCancelBooking);

  return app;
}

import { RequestHandler } from "express";
import crypto from "crypto";
import User from "../models/User";
import Session from "../models/Session";

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate session token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !phone) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Create new user
    const newUser = await User.create({
      email,
      password: hashPassword(password),
      firstName,
      lastName,
      phone,
    });

    // Create session
    const token = generateToken();
    await Session.create({
      token,
      userId: newUser._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    res.json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Create session
    const token = generateToken();
    await Session.create({
      token,
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      await Session.deleteOne({ token });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const handleGetUser: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const session = await Session.findOne({ token });

    if (!session || session.expiresAt < new Date()) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(session.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const handleUpdateUser: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const session = await Session.findOne({ token });

    if (!session || session.expiresAt < new Date()) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const { firstName, lastName, phone } = req.body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(session.userId, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const SESSIONS_FILE = path.join(process.cwd(), "data", "sessions.json");

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON files if they don't exist
function ensureFilesExist() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}, null, 2));
  }
}

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

interface Session {
  [token: string]: {
    userId: string;
    expiresAt: number;
  };
}

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate session token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Read users from file
function readUsers(): User[] {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write users to file
function writeUsers(users: User[]): void {
  ensureFilesExist();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Read sessions from file
function readSessions(): Session {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(SESSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Write sessions to file
function writeSessions(sessions: Session): void {
  ensureFilesExist();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !phone) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const users = readUsers();

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password: hashPassword(password),
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    // Create session
    const token = generateToken();
    const sessions = readSessions();
    sessions[token] = {
      userId: newUser.id,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    writeSessions(sessions);

    res.json({
      token,
      user: {
        id: newUser.id,
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

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const users = readUsers();
    const user = users.find((u) => u.email === email);

    if (!user || user.password !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Create session
    const token = generateToken();
    const sessions = readSessions();
    sessions[token] = {
      userId: user.id,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    writeSessions(sessions);

    res.json({
      token,
      user: {
        id: user.id,
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

export const handleLogout: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const sessions = readSessions();
      delete sessions[token];
      writeSessions(sessions);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const handleGetUser: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const sessions = readSessions();
    const session = sessions[token];

    if (!session || session.expiresAt < Date.now()) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const users = readUsers();
    const user = users.find((u) => u.id === session.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user.id,
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

export const handleUpdateUser: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const sessions = readSessions();
    const session = sessions[token];

    if (!session || session.expiresAt < Date.now()) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === session.userId);

    if (userIndex === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { firstName, lastName, phone } = req.body;
    users[userIndex] = {
      ...users[userIndex],
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
    };

    writeUsers(users);

    res.json({
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        firstName: users[userIndex].firstName,
        lastName: users[userIndex].lastName,
        phone: users[userIndex].phone,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

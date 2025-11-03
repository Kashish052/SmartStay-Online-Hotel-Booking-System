import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BOOKINGS_FILE = path.join(process.cwd(), "data", "bookings.json");
const SESSIONS_FILE = path.join(process.cwd(), "data", "sessions.json");

interface Booking {
  id: string;
  userId: string;
  hotelId: number;
  hotelName: string;
  hotelLocation: string;
  hotelPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

interface Session {
  [token: string]: {
    userId: string;
    expiresAt: number;
  };
}

// Ensure data directory exists
const dataDir = path.dirname(BOOKINGS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON files if they don't exist
function ensureFilesExist() {
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
  }
}

// Read bookings from file
function readBookings(): Booking[] {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write bookings to file
function writeBookings(bookings: Booking[]): void {
  ensureFilesExist();
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// Read sessions from file
function readSessions(): Session {
  try {
    const data = fs.readFileSync(SESSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Verify token and get userId
function verifyToken(token: string): string | null {
  const sessions = readSessions();
  const session = sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session.userId;
}

// Calculate nights between two dates
function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(1, nights);
}

export const handleCreateBooking: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const {
      hotelId,
      hotelName,
      hotelLocation,
      hotelPrice,
      checkIn,
      checkOut,
      guests,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
    } = req.body;

    // Validation
    if (
      !hotelId ||
      !hotelName ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Calculate total price
    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = hotelPrice * nights;

    // Create booking
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId,
      hotelId,
      hotelName,
      hotelLocation,
      hotelPrice,
      checkIn,
      checkOut,
      guests,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const bookings = readBookings();
    bookings.push(newBooking);
    writeBookings(bookings);

    res.json({
      booking: newBooking,
      message: "Booking confirmed successfully!",
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const handleGetUserBookings: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const bookings = readBookings();
    const userBookings = bookings.filter((b) => b.userId === userId);

    res.json({ bookings: userBookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to get bookings" });
  }
};

export const handleGetBooking: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const { bookingId } = req.params;
    const bookings = readBookings();
    const booking = bookings.find(
      (b) => b.id === bookingId && b.userId === userId,
    );

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Failed to get booking" });
  }
};

export const handleCancelBooking: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const { bookingId } = req.params;
    const bookings = readBookings();
    const bookingIndex = bookings.findIndex(
      (b) => b.id === bookingId && b.userId === userId,
    );

    if (bookingIndex === -1) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    bookings[bookingIndex].status = "cancelled";
    writeBookings(bookings);

    res.json({
      booking: bookings[bookingIndex],
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

import { RequestHandler } from "express";
import Booking from "../models/Booking";
import Session from "../models/Session";

// Verify token and get userId
async function verifyToken(token: string): Promise<string | null> {
  const session = await Session.findOne({ token });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.userId.toString();
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

export const handleCreateBooking: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = await verifyToken(token);
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
    const newBooking = await Booking.create({
      userId,
      hotelId,
      hotelName,
      hotelLocation,
      hotelPrice,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
      totalPrice,
      status: "confirmed",
    });

    res.json({
      booking: newBooking,
      message: "Booking confirmed successfully!",
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const handleGetUserBookings: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = await verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to get bookings" });
  }
};

export const handleGetBooking: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = await verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const { bookingId } = req.params;
    const booking = await Booking.findOne({ _id: bookingId, userId });

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

export const handleCancelBooking: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const userId = await verifyToken(token);
    if (!userId) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const { bookingId } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, userId },
      { status: "cancelled" },
      { new: true },
    );

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({
      booking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

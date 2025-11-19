import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  hotelId: number;
  hotelName: string;
  hotelLocation: string;
  hotelPrice: number;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hotelId: {
      type: Number,
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
      trim: true,
    },
    hotelLocation: {
      type: String,
      required: true,
      trim: true,
    },
    hotelPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ checkIn: 1, checkOut: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);

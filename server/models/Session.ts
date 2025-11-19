import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster token lookups
SessionSchema.index({ token: 1 });

// Index for automatic cleanup of expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISession>("Session", SessionSchema);

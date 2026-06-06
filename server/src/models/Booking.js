import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "return_requested",
      "cancelled",
      "completed",
    ],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  paymentIntentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Populate user and car references
BookingSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "user",
    select: "name email",
  }).populate({
    path: "car",
    select: "make model images",
  });
  next();
});

export default mongoose.model("Booking", BookingSchema);

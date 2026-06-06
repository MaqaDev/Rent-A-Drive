import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, "Please provide car make"],
  },
  model: {
    type: String,
    required: [true, "Please provide car model"],
  },
  year: {
    type: Number,
    required: [true, "Please provide car year"],
  },
  category: {
    type: String,
    enum: ["sedan", "suv", "luxury", "economy"],
    required: true,
  },
  transmission: {
    type: String,
    enum: ["auto", "manual"],
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 9,
  },
  pricePerDay: {
    type: Number,
    required: [true, "Please provide price per day"],
  },
  images: [
    {
      url: String,
      publicId: String,
    },
  ],
  available: {
    type: Boolean,
    default: true,
  },
  features: [String],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  description: String,
  location: String,
  mileage: {
    type: Number,
    required: [true, "Please provide car mileage"],
  },
  engineSize: {
    type: String,
    required: [true, "Please provide engine size"],
  },
  fuelConsumption: {
    type: String,
    required: [true, "Please provide fuel consumption"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Car", CarSchema);

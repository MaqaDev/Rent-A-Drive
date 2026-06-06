import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import {
  calculateTotalDays,
  calculateTotalPrice,
} from "../utils/dateHelpers.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate } = req.body;

  if (!carId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const car = await Car.findById(carId);
  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }

  // Check if car is available
  if (!car.available) {
    return res.status(400).json({
      success: false,
      message: "Car is not available",
    });
  }

  const totalDays = calculateTotalDays(startDate, endDate);
  const totalPrice = calculateTotalPrice(car.pricePerDay, totalDays);

  const booking = new Booking({
    user: req.user._id,
    car: carId,
    startDate,
    endDate,
    totalDays,
    totalPrice,
    status: "pending",
    paymentStatus: "unpaid",
  });

  await booking.save();

  res.status(201).json({
    success: true,
    data: booking,
    message: "Booking created successfully",
  });
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("car")
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("car")
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});

export const requestCarReturn = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // Check if user is owner
  const bookingUserId = booking.user._id
    ? booking.user._id.toString()
    : booking.user.toString();
  if (bookingUserId !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to request return for this booking",
    });
  }

  if (booking.status !== "confirmed") {
    return res.status(400).json({
      success: false,
      message: "Only confirmed bookings can be returned",
    });
  }

  booking.status = "return_requested";
  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate("car")
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    data: updatedBooking,
    message: "Return request submitted successfully",
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (
    !status ||
    ![
      "pending",
      "confirmed",
      "return_requested",
      "cancelled",
      "completed",
    ].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  if (status === "confirmed") {
    await Car.findByIdAndUpdate(booking.car, { available: false });
  }

  if (status === "completed" || status === "cancelled") {
    await Car.findByIdAndUpdate(booking.car, { available: true });
  }

  booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  )
    .populate("car")
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    data: booking,
    message: "Booking status updated",
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // Check if user is owner or admin
  const bookingUserId = booking.user._id
    ? booking.user._id.toString()
    : booking.user.toString();
  if (bookingUserId !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to cancel this booking",
    });
  }

  if (booking.status === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "Booking is already cancelled",
    });
  }

  await Car.findByIdAndUpdate(booking.car, { available: true });

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "cancelled" },
    { new: true },
  )
    .populate("car")
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    data: updatedBooking,
    message: "Booking cancelled successfully",
  });
});

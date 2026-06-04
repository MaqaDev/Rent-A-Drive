import express from "express";
import { body } from "express-validator";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  [
    body("carId").notEmpty().withMessage("Car ID is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
  ],
  createBooking,
);

router.get("/my", authenticate, getUserBookings);
router.get("/", authenticate, isAdmin, getAllBookings);

router.put(
  "/:id/status",
  authenticate,
  isAdmin,
  [
    body("status")
      .isIn(["pending", "confirmed", "cancelled", "completed"])
      .withMessage("Invalid status"),
  ],
  updateBookingStatus,
);

router.delete("/:id", authenticate, cancelBooking);

export default router;

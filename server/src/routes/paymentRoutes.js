import express from "express";
import { body } from "express-validator";
import {
  createPaymentIntent,
  handlePaymentWebhook,
  confirmPayment,
} from "../controllers/paymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-payment-intent",
  authenticate,
  [body("bookingId").notEmpty().withMessage("Booking ID is required")],
  createPaymentIntent,
);

router.post(
  "/confirm",
  authenticate,
  [
    body("bookingId").notEmpty().withMessage("Booking ID is required"),
    body("paymentIntentId")
      .notEmpty()
      .withMessage("Payment Intent ID is required"),
  ],
  confirmPayment,
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaymentWebhook,
);

export default router;

import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import stripe from "stripe";

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  try {
    // For mock payment, just return a mock intent
    if (process.env.STRIPE_SECRET_KEY.includes("mock")) {
      const mockIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_secret_${Date.now()}`,
        amount: booking.totalPrice * 100,
        status: "requires_payment_method",
      };

      res.status(200).json({
        success: true,
        data: mockIntent,
        message: "Mock payment intent created",
      });
      return;
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100),
      currency: "usd",
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        intentId: paymentIntent.id,
      },
      message: "Payment intent created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment intent creation failed",
      error: error.message,
    });
  }
});

export const handlePaymentWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    // For mock payments, just acknowledge
    if (process.env.STRIPE_SECRET_KEY.includes("mock")) {
      res.status(200).json({ received: true });
      return;
    }

    const event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const booking = await Booking.findById(paymentIntent.metadata.bookingId);

      if (booking) {
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        await booking.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Webhook error",
      error: error.message,
    });
  }
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentIntentId } = req.body;

  if (!bookingId || !paymentIntentId) {
    return res.status(400).json({
      success: false,
      message: "Booking ID and Payment Intent ID are required",
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // For mock payments, just confirm
  if (
    process.env.STRIPE_SECRET_KEY.includes("mock") ||
    paymentIntentId.includes("mock")
  ) {
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.paymentIntentId = paymentIntentId;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: "Payment confirmed (mock)",
    });
    return;
  }

  try {
    const paymentIntent =
      await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.paymentIntentId = paymentIntentId;
      await booking.save();

      res.status(200).json({
        success: true,
        data: booking,
        message: "Payment confirmed successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment confirmation failed",
      error: error.message,
    });
  }
});

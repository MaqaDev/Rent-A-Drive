import express from "express";
import { body } from "express-validator";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/:id", getCarById);

router.post(
  "/",
  authenticate,
  isAdmin,
  upload.array("images", 5),
  [
    body("make").notEmpty().withMessage("Make is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("year").isInt().withMessage("Year must be an integer"),
    body("category")
      .isIn(["sedan", "suv", "luxury", "economy"])
      .withMessage("Invalid category"),
    body("transmission")
      .isIn(["auto", "manual"])
      .withMessage("Invalid transmission"),
    body("seats")
      .isInt({ min: 1, max: 9 })
      .withMessage("Seats must be between 1 and 9"),
    body("pricePerDay")
      .isFloat({ min: 0 })
      .withMessage("Price per day must be a positive number"),
  ],
  createCar,
);

router.put("/:id", authenticate, isAdmin, updateCar);

router.delete("/:id", authenticate, isAdmin, deleteCar);

export default router;

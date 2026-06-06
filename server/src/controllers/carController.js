import asyncHandler from "express-async-handler";
import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";

export const getAllCars = asyncHandler(async (req, res) => {
  const { category, priceMin, priceMax, available } = req.query;

  let filter = {};
  if (category) filter.category = category;
  if (priceMin || priceMax) {
    filter.pricePerDay = {};
    if (priceMin) filter.pricePerDay.$gte = Number(priceMin);
    if (priceMax) filter.pricePerDay.$lte = Number(priceMax);
  }
  if (available !== undefined) filter.available = available === "true";

  const cars = await Car.find(filter);

  res.status(200).json({
    success: true,
    data: cars,
    count: cars.length,
  });
});

export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }

  res.status(200).json({
    success: true,
    data: car,
  });
});

export const createCar = asyncHandler(async (req, res) => {
  const {
    make,
    model,
    year,
    category,
    transmission,
    seats,
    pricePerDay,
    features,
    description,
    location,
    mileage,
    engineSize,
    fuelConsumption,
  } = req.body;

  if (
    !make ||
    !model ||
    !year ||
    !category ||
    !transmission ||
    !seats ||
    !pricePerDay ||
    !mileage ||
    !engineSize ||
    !fuelConsumption
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const car = new Car({
    make,
    model,
    year,
    category,
    transmission,
    seats,
    pricePerDay,
    features: features ? features.split(",") : [],
    description,
    location,
    mileage,
    engineSize,
    fuelConsumption,
    images: [],
  });

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader
          .upload_stream(
            { folder: "rent-a-drive/cars" },
            async (error, result) => {
              if (error) throw error;
              car.images.push({
                url: result.secure_url,
                publicId: result.public_id,
              });
            },
          )
          .end(file.buffer);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: error.message,
        });
      }
    }
  }

  await car.save();

  res.status(201).json({
    success: true,
    data: car,
    message: "Car created successfully",
  });
});

export const updateCar = asyncHandler(async (req, res) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }

  const updatableFields = [
    "make",
    "model",
    "year",
    "category",
    "transmission",
    "seats",
    "pricePerDay",
    "available",
    "features",
    "description",
    "location",
    "rating",
    "numReviews",
    "mileage",
    "engineSize",
    "fuelConsumption",
  ];
  const updates = {};

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] =
        field === "features" && typeof req.body[field] === "string"
          ? req.body[field].split(",")
          : req.body[field];
    }
  });

  car = await Car.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: car,
    message: "Car updated successfully",
  });
});

export const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }

  // Delete images from Cloudinary
  if (car.images.length > 0) {
    for (const image of car.images) {
      await cloudinary.uploader.destroy(image.publicId);
    }
  }

  await Car.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Car deleted successfully",
  });
});

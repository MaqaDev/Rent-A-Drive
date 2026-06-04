import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  user = new User({ name, email, password, role: "user" });
  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "User registered successfully",
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "Login successful",
    token,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

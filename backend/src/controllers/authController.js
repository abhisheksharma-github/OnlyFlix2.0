import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("An account with this email address already exists.");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, COOKIE_OPTIONS);

  return ApiResponse.created(
    res,
    { user },
    "Account created successfully. Welcome to OnlyFlix."
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = generateToken(user._id);

  res.cookie("token", token, COOKIE_OPTIONS);

  return ApiResponse.success(
    res,
    { user },
    `Welcome back, ${user.fullName}!`
  );
});

export const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    { user: req.user },
    "User profile retrieved successfully."
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });

  return ApiResponse.success(
    res,
    null,
    "Signed out successfully."
  );
});

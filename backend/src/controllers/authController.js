/**
 * @file backend/src/controllers/authController.js
 * @description Auth controller with Prisma-backed registration, login, profile,
 * and logout endpoints. Passwords are hashed with bcrypt (cost 12).
 * Sessions are managed via HttpOnly, SameSite cookies.
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** @type {import("express").CookieOptions} */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: env.COOKIE_MAX_AGE_MS,
};

/**
 * @param {string} userId
 * @returns {string}
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/** Fields exposed to the client — password excluded at query level. */
const USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
};

// ---------------------------------------------------------------------------

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("An account with this email address already exists.");
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { fullName, email, password: hashed },
    select: USER_SELECT,
  });

  const token = signToken(user.id);
  res.cookie("token", token, COOKIE_OPTIONS);

  return ApiResponse.created(res, { user }, "Welcome to OnlyFlix. Account created.");
});

// ---------------------------------------------------------------------------

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const { password: _pw, ...safeUser } = user;
  const token = signToken(safeUser.id);
  res.cookie("token", token, COOKIE_OPTIONS);

  return ApiResponse.success(res, { user: safeUser }, `Welcome back, ${safeUser.fullName}!`);
});

// ---------------------------------------------------------------------------

export const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, { user: req.user }, "Profile retrieved successfully.");
});

// ---------------------------------------------------------------------------

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(fullName && { fullName }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: USER_SELECT,
  });

  return ApiResponse.success(res, { user }, "Profile updated successfully.");
});

// ---------------------------------------------------------------------------

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    throw ApiError.unauthorized("Current password is incorrect.");
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  return ApiResponse.success(res, null, "Password changed successfully.");
});

// ---------------------------------------------------------------------------

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });
  return ApiResponse.success(res, null, "Signed out successfully.");
});

/**
 * @file backend/src/middleware/authMiddleware.js
 * @description JWT-based authentication middleware using Prisma/Neon.
 * Token is read from HttpOnly cookie first, then Authorization header as fallback.
 */

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prisma.js";

/**
 * Strict authentication guard — 401 if no valid token.
 * Attaches req.user (without password) for downstream handlers.
 * @type {import("express").RequestHandler}
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(ApiError.unauthorized("Authentication required. Please sign in."));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(ApiError.unauthorized("User account no longer exists."));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Your session has expired. Please sign in again."));
    }
    return next(ApiError.unauthorized("Invalid authentication token."));
  }
};

/**
 * Optional auth — attaches req.user if a valid token is present, otherwise
 * continues anonymously. Never rejects the request.
 * @type {import("express").RequestHandler}
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true, email: true, fullName: true,
          avatarUrl: true, role: true, createdAt: true,
        },
      });
      if (user) req.user = user;
    }
  } catch {
    // continue anonymously
  }
  next();
};

/**
 * Admin-only guard. Must be used after `authenticate`.
 * @type {import("express").RequestHandler}
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return next(ApiError.forbidden("Administrator privileges required."));
  }
  next();
};

/**
 * @file backend/src/middleware/errorMiddleware.js
 * @description Centralized Express error handler for the entire application.
 *
 * Normalizes all thrown errors into a consistent JSON envelope:
 *   { success: false, error: { code, message, details?, stack? } }
 *
 * Handles Prisma, JWT, Zod, and generic errors uniformly.
 */

import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

// Prisma error codes we care about
const PRISMA_UNIQUE_VIOLATION = "P2002";
const PRISMA_NOT_FOUND = "P2025";
const PRISMA_FOREIGN_KEY = "P2003";

/**
 * Coerce an unknown error into a structured ApiError.
 * @param {unknown} err
 * @returns {ApiError}
 */
function normalizeError(err) {
  if (err instanceof ApiError) return err;

  // Prisma known request error
  if (err?.constructor?.name === "PrismaClientKnownRequestError") {
    if (err.code === PRISMA_UNIQUE_VIOLATION) {
      const field = err.meta?.target?.[0] ?? "field";
      return ApiError.conflict(`A record with that ${field} already exists.`);
    }
    if (err.code === PRISMA_NOT_FOUND) {
      return ApiError.notFound(err.meta?.cause ?? "Record not found.");
    }
    if (err.code === PRISMA_FOREIGN_KEY) {
      return ApiError.badRequest("Related record does not exist.");
    }
  }

  // Prisma validation error
  if (err?.constructor?.name === "PrismaClientValidationError") {
    return ApiError.validation(null, "Invalid data shape sent to the database.");
  }

  // JWT errors
  if (err?.name === "TokenExpiredError") {
    return ApiError.unauthorized("Your session has expired. Please sign in again.");
  }
  if (err?.name === "JsonWebTokenError") {
    return ApiError.unauthorized("Invalid authentication token.");
  }

  // Zod validation
  if (err?.name === "ZodError") {
    const details = err.issues?.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return ApiError.validation(details, "Request validation failed.");
  }

  const statusCode = err?.statusCode || err?.status || 500;
  const message = err?.message || "An unexpected error occurred.";
  return new ApiError(statusCode, message);
}

/**
 * 404 handler — must be registered AFTER all routes.
 * @type {import("express").RequestHandler}
 */
export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`No route matches ${req.method} ${req.originalUrl}`));
};

/**
 * Central error handler — must be registered last with 4-arg signature.
 * @type {import("express").ErrorRequestHandler}
 */
export const errorHandler = (err, req, res, _next) => {
  const error = normalizeError(err);

  if (error.statusCode >= 500) {
    console.error("[OnlyFlix Error]", {
      method: req.method,
      url: req.originalUrl,
      code: error.code,
      message: error.message,
      stack: err?.stack,
    });
  }

  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details != null && { details: error.details }),
      ...(env.NODE_ENV === "development" && { stack: err?.stack }),
    },
  });
};

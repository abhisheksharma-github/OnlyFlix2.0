import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Cannot find endpoint ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform Mongoose validation errors
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    error = ApiError.validation(details, "Validation Error");
  }

  // Transform MongoDB duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = ApiError.conflict(`An account with that ${field} already exists.`);
  }

  // Transform Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Transform generic error to ApiError if not already
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, "INTERNAL_SERVER_ERROR");
  }

  const response = {
    success: false,
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message,
      ...(error.details && { details: error.details }),
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  };

  res.status(error.statusCode || 500).json(response);
};

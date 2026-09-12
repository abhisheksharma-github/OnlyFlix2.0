/**
 * @file backend/src/utils/ApiError.js
 * @description Operational error class with semantic factory methods and
 * structured JSON envelope compatible with the centralized error middleware.
 */

export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {string} code
   * @param {unknown} details
   */
  constructor(
    statusCode,
    message = "Internal Server Error",
    code = "INTERNAL_SERVER_ERROR",
    details = null
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", details = null) {
    return new ApiError(400, message, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Authentication required. Please sign in.", details = null) {
    return new ApiError(401, message, "UNAUTHORIZED", details);
  }

  static forbidden(message = "You do not have permission to perform this action.", details = null) {
    return new ApiError(403, message, "FORBIDDEN", details);
  }

  static notFound(message = "The requested resource could not be found.", details = null) {
    return new ApiError(404, message, "RESOURCE_NOT_FOUND", details);
  }

  static conflict(message = "A resource with that identifier already exists.", details = null) {
    return new ApiError(409, message, "CONFLICT", details);
  }

  static validation(details, message = "One or more fields failed validation.") {
    return new ApiError(422, message, "VALIDATION_ERROR", details);
  }

  static tooManyRequests(message = "Rate limit exceeded. Please try again later.") {
    return new ApiError(429, message, "RATE_LIMIT_EXCEEDED");
  }

  static internal(message = "An unexpected error occurred on the server.") {
    return new ApiError(500, message, "INTERNAL_SERVER_ERROR");
  }

  static serviceUnavailable(message = "An upstream service is temporarily unavailable.") {
    return new ApiError(503, message, "SERVICE_UNAVAILABLE");
  }
}

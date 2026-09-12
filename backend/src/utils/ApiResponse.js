/**
 * @file backend/src/utils/ApiResponse.js
 * @description Standardized JSON response envelope for all successful API responses.
 *
 * Shape:
 *   { success: true, message: "...", data: {...}, meta?: { page, total, ... } }
 */

export class ApiResponse {
  /**
   * @param {number} statusCode
   * @param {unknown} data
   * @param {string} message
   * @param {{ [key: string]: unknown } | null} meta
   */
  constructor(statusCode, data, message = "Success", meta = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data ?? null;
    if (meta) this.meta = meta;
  }

  /**
   * Send a 200 OK response.
   * @param {import("express").Response} res
   * @param {unknown} data
   * @param {string} message
   * @param {{ [key: string]: unknown } | null} meta
   */
  static success(res, data, message = "Success", meta = null) {
    return res.status(200).json(new ApiResponse(200, data, message, meta));
  }

  /**
   * Send a 201 Created response.
   * @param {import("express").Response} res
   * @param {unknown} data
   * @param {string} message
   */
  static created(res, data, message = "Resource created successfully.") {
    return res.status(201).json(new ApiResponse(201, data, message));
  }

  /**
   * Send a 204 No Content response (empty body).
   * @param {import("express").Response} res
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Send a paginated list response.
   * @param {import("express").Response} res
   * @param {unknown[]} items
   * @param {{ page: number; total: number; totalPages: number; hasNext: boolean }} pagination
   * @param {string} message
   */
  static paginated(res, items, pagination, message = "Data retrieved successfully.") {
    return res.status(200).json(new ApiResponse(200, items, message, pagination));
  }
}

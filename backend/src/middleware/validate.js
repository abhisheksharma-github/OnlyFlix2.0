import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return next(ApiError.validation(details, "Invalid request payload"));
    }
    req[source] = result.data;
    next();
  };
};

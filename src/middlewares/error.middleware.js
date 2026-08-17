import mongoose from "mongoose";
import ApiError from "../shared/ApiError.js";
import logger from "../config/logger.js";
import serverConfig from "../config/server.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Normalize known error types into ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = ApiError.conflict(`Duplicate value for field: ${field}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest("Validation failed", messages);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token");
  }
  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token expired");
  }

  logger.error(`${req.method} ${req.originalUrl} - ${error.message}`);

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(serverConfig.isDevelopment && { stack: error.stack }),
  };

  return res.status(error.statusCode || 500).json(response);
};

export default errorMiddleware;

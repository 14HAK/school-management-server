import ApiError from "../shared/ApiError.js";

const notFoundMiddleware = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
};

export default notFoundMiddleware;

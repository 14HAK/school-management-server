/**
 * Wraps an async route/controller function and forwards any error to
 * Express's error-handling middleware instead of requiring try/catch
 * in every controller.
 */
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export default asyncHandler;

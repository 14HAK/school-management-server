import ApiError from "../shared/ApiError.js";

/**
 * Validates req against a Zod schema shaped as { body?, params?, query? }.
 * On failure, raises a 400 ApiError with field-level messages.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.slice(1).join(".") || issue.path.join("."),
      message: issue.message,
    }));
    return next(ApiError.badRequest("Validation failed.", errors));
  }

  // Overwrite with parsed/coerced values
  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;
  if (result.data.query) req.query = result.data.query;

  next();
};

export default validate;

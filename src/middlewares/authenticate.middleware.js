import ApiError from "../shared/ApiError.js";
import asyncHandler from "../shared/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.util.js";
import User from "../modules/user/user.model.js";

/**
 * Verifies the access token (cookie first, Authorization header fallback),
 * loads the user, and attaches req.user for downstream middleware/controllers.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.accessToken || bearer;

  if (!token) {
    throw ApiError.unauthorized("Authentication required.");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired token.");
  }

  const user = await User.findById(payload.sub).populate({
    path: "roleIds",
    populate: { path: "permissions" },
  });

  if (!user || user.isDeleted) {
    throw ApiError.unauthorized("Account no longer exists.");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw ApiError.unauthorized(`Account is ${user.accountStatus.toLowerCase()}.`);
  }

  // Token version check — invalidates old tokens after password change / forced logout-all
  if (payload.tokenVersion !== user.tokenVersion) {
    throw ApiError.unauthorized("Session is no longer valid. Please log in again.");
  }

  req.user = user;
  next();
});

export default authenticate;

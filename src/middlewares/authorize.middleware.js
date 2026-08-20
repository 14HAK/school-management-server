import ApiError from "../shared/ApiError.js";

/**
 * Checks the authenticated user's combined role permissions against the
 * required "resource:action" permission key(s). Requires authenticate()
 * to have run first (needs req.user with populated roleIds.permissions).
 *
 * Usage: router.post("/students", authenticate, authorize("student:create"), ...)
 * Multiple keys = user must have ALL of them.
 */
const authorize =
  (...requiredKeys) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required."));
    }

    // SUPER_ADMIN always passes — full access to every module per 05-rbac.md
    const roleNames = req.user.roleIds.map((role) => role.name);
    if (roleNames.includes("SUPER_ADMIN")) {
      return next();
    }

    const userPermissionKeys = new Set(
      req.user.roleIds.flatMap((role) =>
        (role.permissions || []).map((permission) => permission.key)
      )
    );

    const hasAll = requiredKeys.every((key) => userPermissionKeys.has(key));

    if (!hasAll) {
      return next(ApiError.forbidden("You do not have permission to perform this action."));
    }

    next();
  };

export default authorize;

import jwt from "jsonwebtoken";
import crypto from "crypto";
import jwtConfig from "../config/jwt.js";

/**
 * Access token: userId, roleIds, tokenVersion — short-lived (15m default).
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      roleIds: user.roleIds.map((id) => id.toString()),
      tokenVersion: user.tokenVersion,
    },
    jwtConfig.accessSecret,
    { expiresIn: jwtConfig.accessExpiry }
  );
};

/**
 * Refresh token: userId, sessionId — long-lived (7d default).
 */
export const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign(
    { sub: userId.toString(), sessionId: sessionId.toString() },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiry }
  );
};

export const verifyAccessToken = (token) => jwt.verify(token, jwtConfig.accessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, jwtConfig.refreshSecret);

/**
 * Hash a refresh token before storing it in the Session collection —
 * raw refresh tokens are never persisted.
 */
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

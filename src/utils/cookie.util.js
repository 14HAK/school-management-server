import serverConfig from "../config/server.js";

const baseCookieOptions = {
  httpOnly: true,
  secure: serverConfig.isProduction,
  // Spec calls for SameSite=Strict; relaxed to Lax in dev so the cookie
  // still attaches during local cross-port (localhost:3000 -> :5000) testing.
  sameSite: serverConfig.isProduction ? "strict" : "lax",
};

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};

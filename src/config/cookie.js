import serverConfig from "./server.js";

const cookieConfig = {
  secret: process.env.COOKIE_SECRET || "dev_cookie_secret",
  options: {
    httpOnly: true,
    secure: serverConfig.isProduction,
    sameSite: serverConfig.isProduction ? "strict" : "lax",
  },
};

export default cookieConfig;

import dotenv from "dotenv";

dotenv.config();

const serverConfig = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  apiVersion: process.env.API_VERSION || "v1",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",
};

export default serverConfig;

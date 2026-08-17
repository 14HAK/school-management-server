import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import serverConfig from "./config/server.js";
import corsConfig from "./config/cors.js";
import logger from "./config/logger.js";

import rateLimitMiddleware from "./middlewares/rateLimit.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import v1Routes from "./routes/v1/index.js";
import ApiResponse from "./shared/ApiResponse.js";

const app = express();

// ---- Security middleware ----
app.use(helmet());
app.use(cors(corsConfig));
app.use(hpp());
app.use(rateLimitMiddleware);

// ---- Body & cookie parsing ----
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ---- Request logging ----
const morganFormat = serverConfig.isProduction ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ---- Root health check ----
app.get("/", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "School ERP API is running"));
});

// ---- Versioned API routes ----
app.use(`/api/${serverConfig.apiVersion}`, v1Routes);

// ---- 404 + error handling (must be last) ----
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;

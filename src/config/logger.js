import winston from "winston";
import serverConfig from "./server.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: serverConfig.isProduction ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (!serverConfig.isProduction) {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), errors({ stack: true }), logFormat),
    })
  );
}

export default logger;

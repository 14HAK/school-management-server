import app from "./app.js";
import connectDatabase from "./database/connection.js";
import serverConfig from "./config/server.js";
import logger from "./config/logger.js";

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(serverConfig.port, () => {
    logger.info(
      `Server running in ${serverConfig.env} mode on port ${serverConfig.port}`
    );
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    server.close(() => process.exit(1));
  });
};

startServer();

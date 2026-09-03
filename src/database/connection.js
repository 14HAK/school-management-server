import mongoose from "mongoose";
import databaseConfig from "../config/database.js";
import logger from "../config/logger.js";
// Registers every Mongoose schema before any query/populate can run.
// Placed here (not just in server.js) so it's guaranteed regardless of
// which entry point connects to the database — server.js, a seed script,
// a one-off script, or tests. See models.registry.js for full explanation.
import "./models.registry.js";

const connectDatabase = async () => {
  try {
    if (!databaseConfig.uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(databaseConfig.uri, databaseConfig.options);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    return conn;
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;

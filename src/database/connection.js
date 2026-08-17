import mongoose from "mongoose";
import databaseConfig from "../config/database.js";
import logger from "../config/logger.js";

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

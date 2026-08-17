import dotenv from "dotenv";

dotenv.config();

const databaseConfig = {
  uri:
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI,
  options: {
    autoIndex: process.env.NODE_ENV !== "production",
  },
};

export default databaseConfig;

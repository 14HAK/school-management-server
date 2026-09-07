import mongoose from "mongoose";
import dotenv from "dotenv";
import "../models.registry.js";
import Period from "../../modules/period/period.model.js";
import databaseConfig from "../../config/database.js";
import logger from "../../config/logger.js";

dotenv.config();

// 8 teaching periods + 2 breaks, following the exact pattern shown in
// 12-class-routine-engine.md's example (45-min periods, 15-min break).
const PERIODS = [
  { periodNumber: 1, startTime: "08:00", endTime: "08:45", isBreak: false },
  { periodNumber: 2, startTime: "08:45", endTime: "09:30", isBreak: false },
  { periodNumber: 3, startTime: "09:30", endTime: "09:45", isBreak: true, label: "Break" },
  { periodNumber: 4, startTime: "09:45", endTime: "10:30", isBreak: false },
  { periodNumber: 5, startTime: "10:30", endTime: "11:15", isBreak: false },
  { periodNumber: 6, startTime: "11:15", endTime: "12:00", isBreak: false },
  { periodNumber: 7, startTime: "12:00", endTime: "12:30", isBreak: true, label: "Lunch" },
  { periodNumber: 8, startTime: "12:30", endTime: "13:15", isBreak: false },
  { periodNumber: 9, startTime: "13:15", endTime: "14:00", isBreak: false },
  { periodNumber: 10, startTime: "14:00", endTime: "14:45", isBreak: false },
];

const run = async () => {
  await mongoose.connect(databaseConfig.uri);
  logger.info("Connected to MongoDB for period seeding.");

  let count = 0;
  for (const period of PERIODS) {
    await Period.findOneAndUpdate(
      { periodNumber: period.periodNumber },
      { $setOnInsert: period },
      { upsert: true, new: true }
    );
    count++;
  }

  logger.info(`Seeded/verified ${count} periods.`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Period seeding failed: ${err.message}`);
  process.exit(1);
});

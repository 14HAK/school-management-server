import mongoose from "mongoose";
import dotenv from "dotenv";
import "../models.registry.js";
import Academy from "../../modules/academy/academy.model.js";
import databaseConfig from "../../config/database.js";
import logger from "../../config/logger.js";

dotenv.config();

// Exact room layout from 07-campus-building-room.md. Both buildings
// (ACA-RED, ACA-GREEN) get the same room plan — adjust per-building
// differences later if the real campus differs.
const FLOOR_BY_ROOM_RANGE = (num) => {
  if (num <= 10) return "GROUND_FLOOR";
  if (num <= 30) return "FIRST_FLOOR";
  if (num <= 50) return "SECOND_FLOOR";
  return "THIRD_FLOOR";
};

const ROOM_TYPE_MAP = {
  RM01: "PRINCIPAL_OFFICE",
  RM02: "CLASSROOM",
  RM03: "CLASSROOM",
  RM04: "CLASSROOM",
  RM05: "CLASSROOM",
  RM06: "CLASSROOM",
  RM07: "CLASSROOM",
  RM08: "STAFF_ROOM",
  RM09: "WASHROOM",
  RM10: "BATHROOM",
  RM11: "STAFF_ROOM",
  RM12: "CLASSROOM",
  RM13: "CLASSROOM",
  RM14: "CLASSROOM",
  RM15: "CLASSROOM",
  RM16: "CLASSROOM",
  RM17: "CLASSROOM",
  RM18: "CLASSROOM", // SSC
  RM19: "WASHROOM",
  RM20: "BATHROOM",
  RM21: "STAFF_ROOM",
  RM22: "CLASSROOM",
  RM23: "CLASSROOM",
  RM24: "CLASSROOM",
  RM25: "CLASSROOM",
  RM28: "CLASSROOM", // SSC
  RM29: "WASHROOM",
  RM30: "BATHROOM",
  RM31: "STAFF_ROOM",
  RM32: "CLASSROOM",
  RM33: "CLASSROOM",
  RM34: "CLASSROOM",
  RM35: "CLASSROOM",
  RM36: "CLASSROOM",
  RM37: "CLASSROOM",
  RM38: "CLASSROOM", // SSC
  RM39: "WASHROOM",
  RM40: "BATHROOM",
  RM41: "CAFETERIA",
  RM42: "CAFETERIA",
  RM43: "CAFETERIA",
  RM45: "MOSQUE",
  RM46: "MOSQUE",
  RM47: "MOSQUE",
  RM48: "GATE",
  RM49: "WASHROOM",
  RM50: "BATHROOM",
  RM51: "AUDITORIUM",
  RM52: "AUDITORIUM",
  RM53: "AUDITORIUM",
  RM54: "AUDITORIUM",
  RM55: "AUDITORIUM",
  RM56: "AUDITORIUM",
  RM57: "AUDITORIUM",
  RM58: "COMPUTER_LAB",
  RM59: "WASHROOM",
  RM60: "BATHROOM",
  RM61: "LAB",
  RM62: "LAB",
  RM63: "LAB",
  RM64: "STORE_ROOM",
  RM65: "STORE_ROOM",
  RM66: "STORE_ROOM",
  RM67: "FINANCE_ROOM",
  RM68: "FINANCE_ROOM",
  RM69: "FINANCE_ROOM",
  RM70: "COMPUTER_LAB",
};

const CLASSROOM_CAPACITY = 40;
const DEFAULT_CAPACITY_BY_TYPE = {
  CLASSROOM: 40,
  LAB: 30,
  COMPUTER_LAB: 30,
  LIBRARY: 60,
  PRINCIPAL_OFFICE: 5,
  STAFF_ROOM: 20,
  FINANCE_ROOM: 5,
  AUDITORIUM: 300,
  CAFETERIA: 100,
  MOSQUE: 100,
  STORE_ROOM: 10,
  WASHROOM: 5,
  BATHROOM: 5,
  GATE: 5,
  MEDICAL_ROOM: 10,
  EXAM_ROOM: 40,
};

const BUILDINGS = ["ACA-RED", "ACA-GREEN"];

const run = async () => {
  await mongoose.connect(databaseConfig.uri);
  logger.info("Connected to MongoDB for room seeding.");

  let created = 0;
  let skipped = 0;

  for (const buildingName of BUILDINGS) {
    for (let i = 1; i <= 70; i++) {
      const roomNumber = `RM${String(i).padStart(2, "0")}`;
      const roomType = ROOM_TYPE_MAP[roomNumber];
      if (!roomType) continue; // gaps in the numbering (e.g. RM26/RM27/RM44) are intentional

      const exists = await Academy.findOne({ buildingName, roomNumber });
      if (exists) {
        skipped++;
        continue;
      }

      await Academy.create({
        buildingName,
        roomNumber,
        floor: FLOOR_BY_ROOM_RANGE(i),
        roomType,
        status: "AVAILABLE",
        capacity: DEFAULT_CAPACITY_BY_TYPE[roomType] || CLASSROOM_CAPACITY,
        facilities: roomType === "CLASSROOM" ? ["Whiteboard", "WiFi"] : [],
      });
      created++;
    }
  }

  logger.info(`Room seeding complete. Created: ${created}, already existed: ${skipped}.`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Room seeding failed: ${err.message}`);
  process.exit(1);
});

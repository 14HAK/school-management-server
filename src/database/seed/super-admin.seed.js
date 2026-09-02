import mongoose from "mongoose";
import dotenv from "dotenv";
import "../models.registry.js";
import User from "../../modules/user/user.model.js";
import Role from "../../modules/role/role.model.js";
import databaseConfig from "../../config/database.js";
import logger from "../../config/logger.js";

dotenv.config();

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "superadmin@schoolerp.local";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe@123";

const run = async () => {
  await mongoose.connect(databaseConfig.uri);
  logger.info("Connected to MongoDB for super admin seeding.");

  const superAdminRole = await Role.findOne({ name: "SUPER_ADMIN" });
  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found. Run role-permission.seed.js first.");
  }

  const existing = await User.findOne({ email: SUPER_ADMIN_EMAIL });
  if (existing) {
    logger.info(`Super admin already exists: ${SUPER_ADMIN_EMAIL}`);
  } else {
    await User.create({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD, // hashed by pre-save hook
      roleIds: [superAdminRole._id],
      accountStatus: "ACTIVE",
      emailVerified: true,
    });
    logger.info(`Super admin created: ${SUPER_ADMIN_EMAIL}`);
    logger.info("IMPORTANT: change this password immediately after first login.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Super admin seeding failed: ${err.message}`);
  process.exit(1);
});

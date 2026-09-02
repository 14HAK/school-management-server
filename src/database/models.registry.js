/**
 * Central model registry.
 *
 * Mongoose only registers a schema with mongoose.model(name, schema) when
 * the file that calls it is actually imported somewhere in the running
 * process. Individual modules (auth, student, etc.) only import the models
 * they directly use — so a model that's only ever referenced indirectly via
 * `ref: "..."` in another schema (e.g. Role → Permission, Student → Guardian)
 * can end up NEVER being imported by the running server, even though the
 * seed script imports it fine.
 *
 * Symptom: "Schema hasn't been registered for model 'X'. Use
 * mongoose.model(name, schema)" — thrown at populate() time, not at startup,
 * which makes it easy to miss until that specific populate path runs.
 *
 * Fix: import every model here once, and import THIS file first thing in
 * server.js (before connectDatabase()/app are used). That guarantees every
 * schema is registered exactly once, regardless of which route or service
 * happens to run first.
 *
 * Whenever a new model is added to any module, add it below.
 */

import "../modules/user/user.model.js";
import "../modules/role/role.model.js";
import "../modules/permission/permission.model.js";
import "../modules/session/session.model.js";
import "../modules/auth/otp.model.js";
import "../modules/auth/activityLog.model.js";
import "../modules/student/student.model.js";
import "../modules/teacher/teacher.model.js";
import "../modules/staff/staff.model.js";
import "../modules/guardian/guardian.model.js";

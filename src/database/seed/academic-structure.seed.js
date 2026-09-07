import mongoose from "mongoose";
import dotenv from "dotenv";
import "../models.registry.js";
import Class from "../../modules/class/class.model.js";
import Section from "../../modules/section/section.model.js";
import Group from "../../modules/group/group.model.js";
import Subject from "../../modules/subject/subject.model.js";
import databaseConfig from "../../config/database.js";
import logger from "../../config/logger.js";

dotenv.config();

// Per 08-academic.md
const CLASSES = [
  { name: "Class 0", level: 0, hasGroups: false },
  { name: "Class 1", level: 1, hasGroups: false },
  { name: "Class 2", level: 2, hasGroups: false },
  { name: "Class 3", level: 3, hasGroups: false },
  { name: "Class 4", level: 4, hasGroups: false },
  { name: "Class 5", level: 5, hasGroups: false },
  { name: "Class 6", level: 6, hasGroups: false },
  { name: "Class 7", level: 7, hasGroups: false },
  { name: "Class 8", level: 8, hasGroups: false },
  { name: "Class 9", level: 9, hasGroups: true },
  { name: "Class 10", level: 10, hasGroups: true },
  { name: "SSC", level: 11, hasGroups: true },
];

const GROUPS = ["Science", "Commerce", "Humanities"];

// Class 0–8: Section A, B. Class 9/10/SSC: Section A, B, C. Per 08-academic.md.
const sectionsForClass = (klass) => (klass.hasGroups ? ["A", "B", "C"] : ["A", "B"]);

// Per 09-subject.md §Class Wise Subjects. Classes 1, 2 share the same 4 subjects;
// 3, 4, 5 share the same 7; 6, 7, 8 share the same 11.
const SUBJECTS_1_2 = [
  { name: "বাংলা", code: "BAN" },
  { name: "English", code: "ENG" },
  { name: "গণিত", code: "MATH" },
  { name: "ঈমান", code: "EMAN" },
];

const SUBJECTS_3_5 = [
  { name: "বাংলা", code: "BAN" },
  { name: "English", code: "ENG" },
  { name: "গণিত", code: "MATH" },
  { name: "ইসলাম", code: "ISL" },
  { name: "ঈমান", code: "EMAN" },
  { name: "বিজ্ঞান", code: "SCI" },
  { name: "বিশ্বপরিচয়", code: "WORLD" },
];

const SUBJECTS_6_8 = [
  { name: "বাংলা", code: "BAN1" },
  { name: "বাংলা ২য়", code: "BAN2" },
  { name: "English", code: "ENG1" },
  { name: "English 2nd", code: "ENG2" },
  { name: "গণিত", code: "MATH" },
  { name: "ইসলাম", code: "ISL" },
  { name: "ঈমান", code: "EMAN" },
  { name: "বিজ্ঞান", code: "SCI" },
  { name: "বিশ্বপরিচয়", code: "WORLD" },
  { name: "ICT", code: "ICT" },
  { name: "কৃষি", code: "AGRI" },
];

/**
 * Class 9 / 10 / SSC subjects: the spec lists 22 distinct subject names under
 * a "Total Subjects: 23" heading (an off-by-one in the source document — 22
 * is what's actually enumerated, seeded as-is rather than inventing a 23rd).
 *
 * The spec does not explicitly tag each subject with a group, only stating
 * the three applicable groups (Science/Commerce/Humanities) for these
 * classes. The common-vs-group-specific split below follows the standard
 * Bangladesh NCTB curriculum grouping and is a documented interpretation,
 * not verbatim spec text — group is null for compulsory subjects taken by
 * every group, and set for group-specific subjects.
 */
const SUBJECTS_COMMON_9_10_SSC = [
  { name: "বাংলা", code: "BAN1" },
  { name: "বাংলা ২য়", code: "BAN2" },
  { name: "English", code: "ENG1" },
  { name: "English 2nd", code: "ENG2" },
  { name: "গণিত", code: "MATH" },
  { name: "ইসলাম", code: "ISL" },
  { name: "ঈমান", code: "EMAN" },
  { name: "বিশ্বপরিচয়", code: "WORLD" },
  { name: "ICT", code: "ICT" },
  { name: "কৃষি", code: "AGRI" },
];

const SUBJECTS_SCIENCE_9_10_SSC = [
  { name: "পদার্থবিজ্ঞান", code: "PHY" },
  { name: "রসায়ন", code: "CHEM" },
  { name: "জীববিজ্ঞান", code: "BIO" },
  { name: "উচ্চতর গণিত", code: "HMATH" },
  { name: "বিজ্ঞান", code: "SCI" },
];

const SUBJECTS_COMMERCE_9_10_SSC = [
  { name: "হিসাববিজ্ঞান", code: "ACC" },
  { name: "ফিন্যান্স ও ব্যাংকিং", code: "FIN" },
  { name: "ব্যবসায় উদ্যোগ", code: "BENT" },
];

const SUBJECTS_HUMANITIES_9_10_SSC = [
  { name: "ভূগোল ও পরিবেশ", code: "GEO" },
  { name: "অর্থনীতি", code: "ECO" },
  { name: "কৃষিশিক্ষা", code: "AGRIED" },
  { name: "পৌরনীতি ও নাগরিকতা", code: "CIVICS" },
];

const CLASS_SUBJECT_MAP = {
  "Class 1": SUBJECTS_1_2,
  "Class 2": SUBJECTS_1_2,
  "Class 3": SUBJECTS_3_5,
  "Class 4": SUBJECTS_3_5,
  "Class 5": SUBJECTS_3_5,
  "Class 6": SUBJECTS_6_8,
  "Class 7": SUBJECTS_6_8,
  "Class 8": SUBJECTS_6_8,
};

const run = async () => {
  await mongoose.connect(databaseConfig.uri);
  logger.info("Connected to MongoDB for academic structure seeding.");

  // 1. Classes
  const classDocs = {};
  for (const c of CLASSES) {
    const doc = await Class.findOneAndUpdate(
      { level: c.level },
      { $setOnInsert: c },
      { upsert: true, new: true }
    );
    classDocs[c.name] = doc;
  }
  logger.info(`Seeded ${Object.keys(classDocs).length} classes.`);

  // 2. Sections per class
  let sectionCount = 0;
  for (const c of CLASSES) {
    for (const name of sectionsForClass(c)) {
      await Section.findOneAndUpdate(
        { classId: classDocs[c.name]._id, name },
        { $setOnInsert: { classId: classDocs[c.name]._id, name, capacity: 40 } },
        { upsert: true, new: true }
      );
      sectionCount++;
    }
  }
  logger.info(`Seeded ${sectionCount} sections.`);

  // 3. Groups (global)
  const groupDocs = {};
  for (const name of GROUPS) {
    const doc = await Group.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { upsert: true, new: true }
    );
    groupDocs[name] = doc;
  }
  logger.info(`Seeded ${Object.keys(groupDocs).length} groups.`);

  // 4. Subjects — Class 0 has none listed in spec; Class 1–8 from the fixed maps
  let subjectCount = 0;
  for (const [className, subjects] of Object.entries(CLASS_SUBJECT_MAP)) {
    for (const s of subjects) {
      const subjectCode = `${classDocs[className].level}-${s.code}`;
      const created = await Subject.findOneAndUpdate(
        { classId: classDocs[className]._id, subjectName: s.name },
        {
          $setOnInsert: {
            subjectCode,
            subjectName: s.name,
            classId: classDocs[className]._id,
            group: null,
          },
        },
        { upsert: true, new: true }
      );
      if (created) subjectCount++;
    }
  }

  // Class 9, Class 10, SSC — common + 3 group-specific sets each
  for (const className of ["Class 9", "Class 10", "SSC"]) {
    const classDoc = classDocs[className];

    for (const s of SUBJECTS_COMMON_9_10_SSC) {
      const subjectCode = `${classDoc.level}-${s.code}`;
      await Subject.findOneAndUpdate(
        { classId: classDoc._id, subjectName: s.name },
        {
          $setOnInsert: {
            subjectCode,
            subjectName: s.name,
            classId: classDoc._id,
            group: null,
          },
        },
        { upsert: true, new: true }
      );
      subjectCount++;
    }

    const groupSets = [
      { group: "Science", subjects: SUBJECTS_SCIENCE_9_10_SSC },
      { group: "Commerce", subjects: SUBJECTS_COMMERCE_9_10_SSC },
      { group: "Humanities", subjects: SUBJECTS_HUMANITIES_9_10_SSC },
    ];

    for (const { group, subjects } of groupSets) {
      for (const s of subjects) {
        const subjectCode = `${classDoc.level}-${s.code}`;
        await Subject.findOneAndUpdate(
          { classId: classDoc._id, subjectName: s.name },
          {
            $setOnInsert: {
              subjectCode,
              subjectName: s.name,
              classId: classDoc._id,
              group: groupDocs[group]._id,
            },
          },
          { upsert: true, new: true }
        );
        subjectCount++;
      }
    }
  }

  logger.info(`Seeded/verified ${subjectCount} subject records.`);

  await mongoose.disconnect();
  logger.info("Academic structure seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Academic structure seeding failed: ${err.message}`);
  process.exit(1);
});

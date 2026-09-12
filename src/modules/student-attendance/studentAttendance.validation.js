import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");
const timeString = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format.");
const STATUSES = ["PRESENT", "ABSENT", "LATE", "LEAVE", "HOLIDAY", "HALF_DAY"];

export const createAttendanceSchema = z.object({
  body: z
    .object({
      studentId: objectId,
      academicYearId: objectId,
      classId: objectId,
      sectionId: objectId,
      groupId: objectId.optional(),
      date: z.coerce.date(),
      attendanceStatus: z.enum(STATUSES),
      checkInTime: timeString.optional(),
      checkOutTime: timeString.optional(),
      remarks: z.string().trim().optional(),
    })
    .refine((data) => !data.checkInTime || !data.checkOutTime || data.checkOutTime >= data.checkInTime, {
      message: "Check-out time cannot be earlier than check-in time.",
      path: ["checkOutTime"],
    }),
});

export const bulkCreateAttendanceSchema = z.object({
  body: z.object({
    academicYearId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
    date: z.coerce.date(),
    entries: z
      .array(
        z.object({
          studentId: objectId,
          attendanceStatus: z.enum(STATUSES),
          remarks: z.string().trim().optional(),
        })
      )
      .min(1, "At least one student's attendance is required."),
  }),
});

export const updateAttendanceSchema = z.object({
  body: z.object({
    attendanceStatus: z.enum(STATUSES).optional(),
    checkInTime: timeString.optional(),
    checkOutTime: timeString.optional(),
    remarks: z.string().trim().optional(),
    status: z.enum(["DRAFT", "SUBMITTED", "VERIFIED", "LOCKED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getAttendanceSchema = z.object({
  params: z.object({ id: objectId }),
});

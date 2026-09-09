/**
 * Percentage → Grade/GPA mapping. The spec's Result Fields include `grade`
 * and `gpa` but does not provide the grading table itself (and lists
 * "Automatic GPA Calculation" under Future Scope, referring to a more
 * advanced board-integrated system). This is the standard Bangladesh NCTB
 * grading scale, used as the v1 baseline so Result generation is actually
 * functional now — documented here as an explicit interpretation, not
 * verbatim spec text.
 */
const GRADE_SCALE = [
  { min: 80, grade: "A+", gpa: 5.0 },
  { min: 70, grade: "A", gpa: 4.0 },
  { min: 60, grade: "A-", gpa: 3.5 },
  { min: 50, grade: "B", gpa: 3.0 },
  { min: 40, grade: "C", gpa: 2.0 },
  { min: 33, grade: "D", gpa: 1.0 },
  { min: 0, grade: "F", gpa: 0.0 },
];

export const percentageToGrade = (percentage) => {
  const band = GRADE_SCALE.find((b) => percentage >= b.min);
  return band || GRADE_SCALE[GRADE_SCALE.length - 1];
};

/**
 * A student who fails any single subject (obtainedMarks < passMarks) fails
 * overall regardless of aggregate percentage — standard practice implied by
 * the existence of a per-subject `passMarks` field, though not spelled out
 * verbatim in the spec.
 */
export const FAIL_GRADE = { grade: "F", gpa: 0.0 };

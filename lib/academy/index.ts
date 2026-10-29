import "server-only";
import { getAll, getEntries } from "../content/index.ts";
import { StaticCourseCatalog } from "./static-catalog.ts";
import type { CourseCatalog } from "./types.ts";

/**
 * The catalog every Academy page reads. Swap the implementation here when
 * the LMS arrives; pages do not change.
 */
export const courseCatalog: CourseCatalog = new StaticCourseCatalog({
  categories: () => getAll("academyCategory"),
  courses: () => getEntries("academyCourse"),
  lessons: () => getEntries("academyLesson"),
});

export type {
  Category,
  Course,
  CourseCatalog,
  CourseDetail,
  CourseTag,
  Lesson,
  LessonSummary,
  Resource,
  Section,
} from "./types.ts";

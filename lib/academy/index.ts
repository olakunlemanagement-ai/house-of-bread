import "server-only";
import { getAll, getEntry } from "../content/index.ts";
import { StaticCourseCatalog } from "./static-catalog.ts";
import type { CourseCatalog } from "./types.ts";

/**
 * The catalog every Academy page reads. Swap the implementation here when
 * the LMS arrives; pages do not change.
 */
export const courseCatalog: CourseCatalog = new StaticCourseCatalog({
  all: () => getAll("class"),
  one: (slug) => getEntry("class", slug),
});

export type { Course, CourseCatalog, CourseDetail, CourseStatus } from "./types.ts";

// The Academy's course catalog, as the website sees it. Pages depend on this
// interface only. Today StaticCourseCatalog reads the MDX class files; a
// later custom LMS or hosted platform plugs in behind the same interface.
// Framework free: no Next.js or React imports.

/** "open" only once a course has a way to join. Until then "coming-soon". */
export type CourseStatus = "coming-soon" | "open";

export type Course = {
  slug: string;
  title: string;
  /** One sentence, shown on cards and as the page lead. */
  summary: string;
  status: CourseStatus;
  /** True while the ministry has not yet supplied the real course. */
  placeholder: boolean;
};

export type CourseDetail = Course & {
  /** What the course covers, as MDX source. */
  overview: string;
  audience?: string;
  schedule?: string;
  cost?: string;
  /** https only. Present only when the course is open. */
  joinUrl?: string;
};

export interface CourseCatalog {
  /** Every course, in display order. */
  listCourses(): Promise<Course[]>;
  /** One course with its detail, or undefined for an unknown slug. */
  getCourse(slug: string): Promise<CourseDetail | undefined>;
}

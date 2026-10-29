// The Academy's course catalog, as the website sees it: Category, Course,
// Section, Lesson. Pages depend on this interface only. Today
// StaticCourseCatalog reads the MDX in content/academy; a later LMS or
// hosted platform plugs in behind the same interface.
// Totals (lessons and minutes per section and course) are computed, never typed.
// Framework free: no Next.js or React imports.

import type { ImageSlotId } from "../media/image-slots.ts";

export type Category = {
  slug: string;
  title: string;
  /** True while the ministry has not confirmed the name. */
  placeholder: boolean;
};

export type CourseTag = "New" | "Small-group guide";

/** One lesson as listed: in a section's timeline, the lesson list, a pager. */
export type LessonSummary = {
  slug: string;
  /** Position in the whole course, 1 to N. */
  number: number;
  /** The section's number. */
  section: number;
  title: string;
  /** One line. */
  description: string;
  minutes: number;
  hasVideo: boolean;
};

export type Section = {
  number: number;
  title: string;
  /** One paragraph. */
  description: string;
  image: ImageSlotId;
  lessons: LessonSummary[];
  /** Computed: the first and last lesson numbers, and the total time. */
  firstLesson: number;
  lastLesson: number;
  minutes: number;
};

/** A course as the catalogue shows it. */
export type Course = {
  slug: string;
  title: string;
  /** Opens with a question, then two or three sentences. Shown on rows and as the page lead. */
  summary: string;
  /** For example "Matthew 1-4". In [brackets] while a placeholder. */
  scriptureRange: string;
  teacher: string;
  category: string;
  startHere: boolean;
  tags: CourseTag[];
  image: ImageSlotId;
  /** True while the ministry has not supplied the real course. */
  placeholder: boolean;
  /** Computed totals. */
  sections: number;
  lessons: number;
  minutes: number;
  /** The average lesson, rounded to 5 minutes, for "N lessons · about N min each". */
  minutesPerLesson: number;
  /** Every lesson's slug, in order: progress and "Continue learning" read it. */
  lessonSlugs: string[];
};

export type Resource = { title: string; kind: "PDF"; file?: string };

export type CourseDetail = Omit<Course, "sections"> & {
  /** Overview prose, as MDX source. */
  overview: string;
  outcomes: string[];
  teacherBio?: string;
  trailerVideoId?: string;
  resources: Resource[];
  sections: Section[];
  sectionCount: number;
};

export type Lesson = LessonSummary & {
  course: string;
  /** Notes, as MDX source. Empty when there are none. */
  notes: string;
  videoId?: string;
  /** Plain text, paragraphs split by a blank line. */
  transcript?: string;
  reflection?: { question: string; response: string };
  notesFile?: string;
  placeholder: boolean;
};

export interface CourseCatalog {
  /** Every category, in display order. */
  listCategories(): Promise<Category[]>;
  /** Every course: by category order, then course order within it. */
  listCourses(): Promise<Course[]>;
  /** One course with its sections and lessons, or undefined for an unknown slug. */
  getCourse(slug: string): Promise<CourseDetail | undefined>;
  /** One lesson of a course, or undefined. */
  getLesson(course: string, lesson: string): Promise<Lesson | undefined>;
}

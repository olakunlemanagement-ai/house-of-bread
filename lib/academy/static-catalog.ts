import type { Course, CourseCatalog, CourseDetail } from "./types.ts";

/** The class frontmatter fields the catalog reads. Matches classSchema in lib/content. */
export type ClassRecord = {
  slug: string;
  title: string;
  description: string;
  placeholder?: boolean;
  audience?: string;
  schedule?: string;
  cost?: string;
  joinUrl?: string;
  lessons?: number;
  minutesPerLesson?: number;
  outcomes?: string[];
  outline?: string[];
  teacher?: string;
};

/** Where the static catalog reads classes from. lib/academy/index.ts passes lib/content. */
export type ClassSource = {
  all(): ClassRecord[];
  one(slug: string): { data: ClassRecord; body: string } | undefined;
};

function toCourse(data: ClassRecord): Course {
  return {
    slug: data.slug,
    title: data.title,
    summary: data.description,
    status: data.joinUrl ? "open" : "coming-soon",
    placeholder: data.placeholder === true,
    // Only when supplied, so a course without them keeps the same shape.
    ...(data.lessons !== undefined ? { lessons: data.lessons } : {}),
    ...(data.minutesPerLesson !== undefined ? { minutesPerLesson: data.minutesPerLesson } : {}),
  };
}

/** Courses from the MDX class files in content/classes, read at build time. */
export class StaticCourseCatalog implements CourseCatalog {
  constructor(private readonly source: ClassSource) {}

  async listCourses(): Promise<Course[]> {
    return this.source.all().map(toCourse);
  }

  async getCourse(slug: string): Promise<CourseDetail | undefined> {
    const found = this.source.one(slug);
    if (!found) return undefined;
    const { data, body } = found;
    return {
      ...toCourse(data),
      overview: body,
      audience: data.audience,
      schedule: data.schedule,
      cost: data.cost,
      joinUrl: data.joinUrl,
      outcomes: data.outcomes,
      outline: data.outline,
      teacher: data.teacher,
    };
  }
}

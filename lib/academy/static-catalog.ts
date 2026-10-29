import type { AcademyCategoryData, AcademyCourseData, AcademyLessonData } from "../content/schemas.ts";
import type { Category, Course, CourseCatalog, CourseDetail, Lesson, LessonSummary, Section } from "./types.ts";

type WithBody<T> = { data: T; body: string };

/** Where the static catalog reads from. lib/academy/index.ts passes lib/content. */
export type AcademySource = {
  categories(): AcademyCategoryData[];
  courses(): WithBody<AcademyCourseData>[];
  lessons(): WithBody<AcademyLessonData>[];
};

/** Rounds an average lesson to the nearest 5 minutes, never below 5. */
export function roundToFive(minutes: number): number {
  return Math.max(5, Math.round(minutes / 5) * 5);
}

function summaryOf(data: AcademyLessonData): LessonSummary {
  return {
    slug: data.slug,
    number: data.number,
    section: data.section,
    title: data.title,
    description: data.description,
    minutes: data.minutes,
    hasVideo: data.videoId !== undefined,
  };
}

/** A course's sections with their lessons and computed totals. */
export function buildSections(course: AcademyCourseData, lessons: LessonSummary[]): Section[] {
  return course.sections.map((section) => {
    const own = lessons.filter((lesson) => lesson.section === section.number);
    return {
      number: section.number,
      title: section.title,
      description: section.description,
      image: section.image,
      lessons: own,
      firstLesson: own[0]?.number ?? 0,
      lastLesson: own.at(-1)?.number ?? 0,
      minutes: own.reduce((sum, lesson) => sum + lesson.minutes, 0),
    };
  });
}

/** Courses, sections and lessons from content/academy, read at build time. */
export class StaticCourseCatalog implements CourseCatalog {
  constructor(private readonly source: AcademySource) {}

  private lessonsOf(course: string): WithBody<AcademyLessonData>[] {
    return this.source
      .lessons()
      .filter((entry) => entry.data.course === course)
      .sort((a, b) => a.data.number - b.data.number);
  }

  private toCourse(data: AcademyCourseData): Course {
    const lessons = this.lessonsOf(data.slug).map((entry) => entry.data);
    const minutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
    return {
      slug: data.slug,
      title: data.title,
      summary: data.description,
      scriptureRange: data.scriptureRange,
      teacher: data.teacher,
      category: data.category,
      startHere: data.startHere,
      tags: data.tags,
      image: data.image,
      placeholder: data.placeholder,
      sections: data.sections.length,
      lessons: lessons.length,
      minutes,
      minutesPerLesson: lessons.length > 0 ? roundToFive(minutes / lessons.length) : 0,
      lessonSlugs: lessons.map((lesson) => lesson.slug),
    };
  }

  async listCategories(): Promise<Category[]> {
    return this.source.categories().map((data) => ({ slug: data.slug, title: data.title, placeholder: data.placeholder }));
  }

  async listCourses(): Promise<Course[]> {
    const order = new Map(this.source.categories().map((category) => [category.slug, category.order]));
    return this.source
      .courses()
      .map((entry) => entry.data)
      .sort((a, b) => (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0) || a.order - b.order)
      .map((data) => this.toCourse(data));
  }

  async getCourse(slug: string): Promise<CourseDetail | undefined> {
    const found = this.source.courses().find((entry) => entry.data.slug === slug);
    if (!found) return undefined;
    const { data, body } = found;
    const lessons = this.lessonsOf(slug).map((entry) => summaryOf(entry.data));
    const { sections, ...course } = this.toCourse(data);
    return {
      ...course,
      overview: body,
      outcomes: data.outcomes,
      teacherBio: data.teacherBio,
      trailerVideoId: data.trailerVideoId,
      resources: data.resources,
      sections: buildSections(data, lessons),
      sectionCount: sections,
    };
  }

  async getLesson(course: string, lesson: string): Promise<Lesson | undefined> {
    const found = this.lessonsOf(course).find((entry) => entry.data.slug === lesson);
    if (!found) return undefined;
    const { data, body } = found;
    return {
      ...summaryOf(data),
      course: data.course,
      notes: body.trim(),
      videoId: data.videoId,
      transcript: data.transcript?.trim(),
      reflection: data.reflection,
      notesFile: data.notesFile,
      placeholder: data.placeholder,
    };
  }
}

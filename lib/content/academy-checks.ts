// House of Bread Academy rules that span files: each course's category
// exists, each lesson's course and section exist, lessons are numbered 1 to N
// with no gaps and run through the sections in order, every section has a
// lesson, and exactly one course is the Start Here course. Framework free,
// run by the Next loader and by `npm run content:validate`.

import type { ContentError, Library } from "./core.ts";

export function academyErrors(library: Pick<Library, "academyCategory" | "academyCourse" | "academyLesson">): ContentError[] {
  const errors: ContentError[] = [];
  const categories = new Map(library.academyCategory.map((entry) => [entry.data.slug, entry]));
  const courses = new Map(library.academyCourse.map((entry) => [entry.data.slug, entry]));

  // Category order: unique, so the catalogue order is never a tie.
  const categoryOrders = new Map<number, string>();
  for (const { file, data } of library.academyCategory) {
    const taken = categoryOrders.get(data.order);
    if (taken) errors.push({ file, field: "order", message: `${data.order} is already used by the category "${taken}"` });
    else categoryOrders.set(data.order, data.slug);
  }

  // Courses: a real category, a unique order within it, one Start Here.
  const courseOrders = new Map<string, string>();
  for (const { file, data } of library.academyCourse) {
    if (!categories.has(data.category)) {
      errors.push({ file, field: "category", message: `"${data.category}" is not a category in content/academy/categories` });
    }
    const key = `${data.category}:${data.order}`;
    const taken = courseOrders.get(key);
    if (taken) errors.push({ file, field: "order", message: `${data.order} is already used in "${data.category}" by "${taken}"` });
    else courseOrders.set(key, data.slug);
  }
  const startHere = library.academyCourse.filter((entry) => entry.data.startHere);
  if (library.academyCourse.length > 0 && startHere.length !== 1) {
    errors.push({
      file: "content/academy/courses",
      field: "startHere",
      message:
        startHere.length === 0
          ? "one course must be marked startHere: true"
          : `only one course may be marked startHere: true, found ${startHere.map((entry) => entry.data.slug).join(", ")}`,
    });
  }

  // Lessons: grouped per course, then checked as a sequence.
  const byCourse = new Map<string, Library["academyLesson"]>();
  for (const entry of library.academyLesson) {
    const course = courses.get(entry.data.course);
    if (!course) {
      errors.push({ file: entry.file, field: "course", message: `"${entry.data.course}" is not a course in content/academy/courses` });
      continue;
    }
    if (!course.data.sections.some((section) => section.number === entry.data.section)) {
      errors.push({
        file: entry.file,
        field: "section",
        message: `${entry.data.course} has no section ${entry.data.section} (it has 1 to ${course.data.sections.length})`,
      });
      continue;
    }
    byCourse.set(entry.data.course, [...(byCourse.get(entry.data.course) ?? []), entry]);
  }

  for (const { file, data } of library.academyCourse) {
    const lessons = [...(byCourse.get(data.slug) ?? [])].sort((a, b) => a.data.number - b.data.number);
    if (lessons.length === 0) {
      errors.push({ file, message: `has no lessons in content/academy/lessons/${data.slug}/` });
      continue;
    }
    lessons.forEach((lesson, index) => {
      if (lesson.data.number !== index + 1) {
        errors.push({
          file: lesson.file,
          field: "number",
          message: `is ${lesson.data.number}, expected ${index + 1}: lessons are numbered 1 to ${lessons.length} with no gaps or repeats`,
        });
      }
      const before = lessons[index - 1];
      if (before && lesson.data.section < before.data.section) {
        errors.push({
          file: lesson.file,
          field: "section",
          message: `lesson ${lesson.data.number} is in section ${lesson.data.section}, before lesson ${before.data.number} in section ${before.data.section}: lessons run through the sections in order`,
        });
      }
    });
    for (const section of data.sections) {
      if (!lessons.some((lesson) => lesson.data.section === section.number)) {
        errors.push({ file, field: `sections.${section.number - 1}`, message: `section ${section.number} has no lessons` });
      }
    }
  }

  return errors;
}

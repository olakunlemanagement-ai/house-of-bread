// Moving through a course: the lesson before and after, where to resume,
// progress as a state, the tab in the URL, and time as words.
// Framework free, so it is tested on its own and runs on server and client.

export type Neighbours = {
  /** The previous lesson's slug, absent on the first lesson. */
  previous?: string;
  /** The next lesson's slug, absent on the last: the page shows "Finish course". */
  next?: string;
  /** 1 to N. 0 when the lesson is not in the course. */
  position: number;
  total: number;
};

/** The lessons either side of `current`, in course order. */
export function lessonNeighbours(lessonSlugs: readonly string[], current: string): Neighbours {
  const index = lessonSlugs.indexOf(current);
  if (index === -1) return { position: 0, total: lessonSlugs.length };
  return {
    ...(index > 0 ? { previous: lessonSlugs[index - 1] } : {}),
    ...(index < lessonSlugs.length - 1 ? { next: lessonSlugs[index + 1] } : {}),
    position: index + 1,
    total: lessonSlugs.length,
  };
}

export type ProgressStatus = "not-started" | "in-progress" | "completed";

export type CourseProgress = {
  status: ProgressStatus;
  /** Lessons done that are still in the course. */
  done: number;
  total: number;
  /** The next unfinished lesson in order, or the first when nothing is done. Absent when completed. */
  resume?: string;
};

/**
 * Progress through a course from the set of completed lesson slugs. A slug
 * no longer in the course (renamed or removed) does not count.
 */
export function courseProgress(lessonSlugs: readonly string[], completed: ReadonlySet<string>): CourseProgress {
  const done = lessonSlugs.filter((slug) => completed.has(slug)).length;
  const total = lessonSlugs.length;
  const resume = lessonSlugs.find((slug) => !completed.has(slug));
  const status: ProgressStatus = total > 0 && done === total ? "completed" : done > 0 ? "in-progress" : "not-started";
  return { status, done, total, ...(resume !== undefined ? { resume } : {}) };
}

/** The words for a course's progress: "Not started", "3 of 12 lessons", "Completed". */
export function progressLabel(progress: CourseProgress): string {
  if (progress.status === "completed") return "Completed";
  if (progress.status === "not-started") return "Not started";
  return `${progress.done} of ${progress.total} lessons`;
}

/** The tab named by `?tab=` in a query string, if it is one of `allowed`; otherwise the fallback. */
export function parseTab<T extends string>(search: string, allowed: readonly T[], fallback: T): T {
  const value = new URLSearchParams(search).get("tab");
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** The query string with `?tab=` set, or removed for the default tab, keeping every other parameter. */
export function withTab(search: string, tab: string, fallback: string): string {
  const params = new URLSearchParams(search);
  if (tab === fallback) params.delete("tab");
  else params.set("tab", tab);
  const text = params.toString();
  return text ? `?${text}` : "";
}

/** "45 min", "1 hr", "2 hr 5 min". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

/** "1 lesson", "12 lessons". */
export function count(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * The two courses behind "Where are you starting from?": 01 (new to the
 * Bible) opens the Start Here course; 02 (book by book) opens the first
 * course in another category. Stand-ins until the ministry names the
 * [foundations course] and the [book-by-book course].
 */
export function startingCourses<T extends { startHere: boolean; category: string }>(
  courses: readonly T[],
): [T | undefined, T | undefined] {
  const first = courses.find((course) => course.startHere) ?? courses[0];
  const second = courses.find((course) => course !== first && course.category !== first?.category) ?? courses.find((course) => course !== first);
  return [first, second];
}

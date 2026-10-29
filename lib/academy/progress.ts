// Lesson progress for the Academy, with no sign in. The interface is the
// seam: today LocalLessonProgress keeps it in this browser (localStorage);
// later an account backed store (synced progress, certificates) plugs in
// behind the same interface, and no component changes. This is separate from
// lib/app-integration, which reads the app's reading plans on the server.
// Framework free.

export const PROGRESS_KEY = "hob:academy-progress";

/** Completed lesson slugs, per course slug. Treat as read only: a change replaces the object. */
export type ProgressSnapshot = Readonly<Record<string, readonly string[]>>;

export interface LessonProgressStore {
  /** Everything completed. The same object until something changes, so React can compare it. */
  snapshot(): ProgressSnapshot;
  /** Marks a lesson complete, or not complete again. */
  setCompleted(course: string, lesson: string, done: boolean): void;
  /** Called after every change, here or in another tab. Returns the unsubscribe. */
  subscribe(listener: () => void): () => void;
}

export const EMPTY_PROGRESS: ProgressSnapshot = Object.freeze({});

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Reads what was stored, keeping only well formed entries: anything else
 * (an old version, a hand edit, another site's data) counts as nothing done.
 */
export function parseStored(raw: string | null): ProgressSnapshot {
  if (!raw) return EMPTY_PROGRESS;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return EMPTY_PROGRESS;
  }
  if (typeof value !== "object" || value === null || !("v" in value) || value.v !== 1 || !("courses" in value)) {
    return EMPTY_PROGRESS;
  }
  const courses = value.courses;
  if (typeof courses !== "object" || courses === null) return EMPTY_PROGRESS;
  const result: Record<string, string[]> = {};
  for (const [course, lessons] of Object.entries(courses)) {
    if (!SLUG.test(course) || !Array.isArray(lessons)) continue;
    const clean = [...new Set(lessons.filter((lesson): lesson is string => typeof lesson === "string" && SLUG.test(lesson)))];
    if (clean.length > 0) result[course] = clean;
  }
  return result;
}

export function serialise(snapshot: ProgressSnapshot): string {
  return JSON.stringify({ v: 1, courses: snapshot });
}

/** The completed lessons of one course, as a set. */
export function completedIn(snapshot: ProgressSnapshot, course: string): ReadonlySet<string> {
  return new Set(snapshot[course] ?? []);
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** Events the store listens to for changes from other tabs. */
export type StorageEvents = {
  addEventListener(type: "storage", listener: (event: { key: string | null; newValue: string | null }) => void): void;
  removeEventListener(type: "storage", listener: (event: { key: string | null; newValue: string | null }) => void): void;
};

/**
 * Progress kept in this browser. Storage may be missing or throw (private
 * windows, blocked site data, a full quota): then progress lives in memory
 * for this page view, and nothing breaks.
 */
export class LocalLessonProgress implements LessonProgressStore {
  private current: ProgressSnapshot | undefined;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly storage: () => StorageLike | null,
    private readonly events?: StorageEvents,
  ) {}

  private read(): ProgressSnapshot {
    try {
      return parseStored(this.storage()?.getItem(PROGRESS_KEY) ?? null);
    } catch {
      return EMPTY_PROGRESS;
    }
  }

  snapshot(): ProgressSnapshot {
    this.current ??= this.read();
    return this.current;
  }

  setCompleted(course: string, lesson: string, done: boolean): void {
    const before = this.snapshot();
    const lessons = new Set(before[course] ?? []);
    if (lessons.has(lesson) === done) return;
    if (done) lessons.add(lesson);
    else lessons.delete(lesson);
    const next: Record<string, readonly string[]> = { ...before };
    if (lessons.size > 0) next[course] = [...lessons];
    else delete next[course];
    this.current = next;
    try {
      this.storage()?.setItem(PROGRESS_KEY, serialise(next));
    } catch {
      // Storage blocked or full: progress still holds for this page view.
    }
    this.emit();
  }

  private readonly onStorage = (event: { key: string | null; newValue: string | null }) => {
    if (event.key !== PROGRESS_KEY && event.key !== null) return;
    this.current = parseStored(event.newValue);
    this.emit();
  };

  private emit() {
    for (const listener of this.listeners) listener();
  }

  subscribe(listener: () => void): () => void {
    if (this.listeners.size === 0) this.events?.addEventListener("storage", this.onStorage);
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.events?.removeEventListener("storage", this.onStorage);
    };
  }
}

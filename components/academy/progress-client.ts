"use client";

import { useMemo, useSyncExternalStore } from "react";
import { courseProgress, type CourseProgress } from "@/lib/academy/navigation";
import { completedIn, EMPTY_PROGRESS, LocalLessonProgress, type LessonProgressStore, type ProgressSnapshot } from "@/lib/academy/progress";

// The one store per page, made on first use in the browser. Reading
// window.localStorage can throw (blocked site data), so it sits in try/catch.
let store: LessonProgressStore | undefined;

function getStore(): LessonProgressStore {
  store ??= new LocalLessonProgress(() => {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }, window);
  return store;
}

const subscribe = (listener: () => void) => getStore().subscribe(listener);
const getSnapshot = () => getStore().snapshot();
// The server render, and the first client render, show nothing done ("Not
// started"); stored progress appears straight after hydration.
const getServerSnapshot = () => EMPTY_PROGRESS;

/** Everything completed in this browser. Empty on the server and during hydration. */
export function useProgressSnapshot(): ProgressSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** One course's progress: status, counts and where to resume. */
export function useCourseProgress(course: string, lessonSlugs: readonly string[]): CourseProgress & { completed: ReadonlySet<string> } {
  const snapshot = useProgressSnapshot();
  return useMemo(() => {
    const completed = completedIn(snapshot, course);
    return { ...courseProgress(lessonSlugs, completed), completed };
  }, [snapshot, course, lessonSlugs]);
}

/** Marks a lesson complete, or not complete again, in this browser. */
export function setLessonCompleted(course: string, lesson: string, done: boolean): void {
  getStore().setCompleted(course, lesson, done);
}

"use client";

import { progressLabel, type ProgressStatus } from "@/lib/academy/navigation";
import { useCourseProgress } from "./progress-client";

const dotClass: Record<ProgressStatus, string> = {
  "not-started": "border border-glyph",
  "in-progress": "border border-glyph [background:linear-gradient(90deg,var(--glyph)_50%,transparent_50%)]",
  completed: "bg-glyph",
};

/**
 * "Not started", "3 of 12 lessons" or "Completed", with a small dot. The
 * server and the first client render say "Not started"; progress stored in
 * this browser shows straight after hydration. The line keeps one height
 * throughout, so nothing shifts.
 */
export function ProgressLabel({
  course,
  lessons,
  className = "",
}: {
  course: string;
  lessons: readonly string[];
  className?: string;
}) {
  const progress = useCourseProgress(course, lessons);
  return (
    <span data-progress={progress.status} className={`inline-flex h-6 items-center gap-2 text-sm text-ink-muted ${className}`}>
      <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${dotClass[progress.status]}`} />
      {progressLabel(progress)}
    </span>
  );
}

"use client";

import { useCourseProgress } from "@/components/academy/progress-client";
import { Icon } from "@/components/shared/icons";
import { courseProgress, progressLabel } from "@/lib/academy/navigation";

type SectionRef = { course: string; lessons: readonly string[] };

function useSection({ course, lessons }: SectionRef) {
  const { completed } = useCourseProgress(course, lessons);
  return courseProgress(lessons, completed);
}

/** The ring around a section's image: the share of its lessons done. */
export function SectionRing(props: SectionRef) {
  const progress = useSection(props);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const share = progress.total > 0 ? progress.done / progress.total : 0;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="absolute inset-0 size-full -rotate-90">
      <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="4" className="stroke-tint-strong" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - share)}
        className={`stroke-glyph ${share === 0 ? "opacity-0" : ""}`}
      />
    </svg>
  );
}

/** "Not started", "1 of 4 lessons" or "Completed", under the ring. One height in every state. */
export function SectionStatus(props: SectionRef) {
  const progress = useSection(props);
  return (
    <span data-progress={progress.status} className="block h-5 text-center text-xs font-semibold leading-5 text-ink-muted">
      {progressLabel(progress)}
    </span>
  );
}

/** A lesson's marker on the timeline: an empty circle, or a filled one with a tick once completed. */
export function LessonMarker({ course, lesson }: { course: string; lesson: string }) {
  const { completed } = useCourseProgress(course, [lesson]);
  const done = completed.has(lesson);
  return (
    <span
      data-completed={done ? "" : undefined}
      className={`relative flex size-6 items-center justify-center rounded-full border-2 ${
        done ? "border-glyph bg-glyph text-surface-raised" : "border-glyph bg-surface-raised"
      }`}
    >
      {done ? <Icon name="check" className="size-3.5" strokeWidth={3} /> : null}
      <span className="sr-only">{done ? "Completed" : "Not started"}</span>
    </span>
  );
}

"use client";

import type { Route } from "next";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useCourseProgress } from "@/components/academy/progress-client";
import { selectTab } from "@/components/academy/TabList";
import { ButtonLabel, buttonClasses } from "@/components/shared/Button";
import { progressLabel } from "@/lib/academy/navigation";

type CourseRef = { course: string; title: string; lessons: readonly string[] };

/**
 * The hero's progress bar: "Not started", "3 of 12 lessons" or
 * "Completed", over a thin bar. One fixed height in every state, so the
 * label arriving after hydration moves nothing.
 */
export function CourseProgressBar({ course, lessons }: Omit<CourseRef, "title">) {
  const progress = useCourseProgress(course, lessons);
  const share = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  return (
    <div data-progress={progress.status} className="max-w-sm">
      <p className="h-6 text-sm font-semibold text-ink">{progressLabel(progress)}</p>
      <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-tint-strong">
        <div className="h-full rounded-full bg-glyph" style={{ width: `${share}%` }} />
      </div>
    </div>
  );
}

/**
 * The hero's buttons. "Start this course" opens the first lesson; with
 * lessons done it becomes "Continue learning" and opens the next unfinished
 * one. A fixed minimum width keeps the trailer button beside it still when
 * the label changes. "Watch the trailer" (only with a trailer) opens the
 * Overview tab at the trailer; without script it jumps to it, since every
 * panel shows then.
 */
export function CourseActions({ course, title, lessons, hasTrailer }: CourseRef & { hasTrailer: boolean }) {
  const progress = useCourseProgress(course, lessons);
  const inProgress = progress.status === "in-progress";
  const target = (inProgress ? progress.resume : lessons[0]) ?? lessons[0];
  const href = (target ? `/academy/${course}/${target}` : `/academy/${course}`) as Route;

  function openTrailer(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    selectTab("overview");
    // After the panel shows, bring the trailer into view.
    requestAnimationFrame(() => document.getElementById("trailer")?.scrollIntoView({ block: "start" }));
  }

  return (
    <>
      <Link href={href} className={buttonClasses("primary", "light", "sm:min-w-[15.5rem]")}>
        <ButtonLabel>
          {inProgress ? "Continue learning" : "Start this course"}
          <span className="sr-only">: {title}</span>
        </ButtonLabel>
      </Link>
      {hasTrailer ? (
        <a href="#trailer" onClick={openTrailer} className={buttonClasses("secondary")}>
          <ButtonLabel>Watch the trailer</ButtonLabel>
        </a>
      ) : null}
    </>
  );
}

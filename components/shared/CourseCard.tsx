import type { Route } from "next";
import type { Course } from "@/lib/academy/types";
import { ButtonLink } from "./Button";
import { Placeholder } from "./Placeholder";

/**
 * A course from the catalogue: a small "Free" badge, the title, its
 * one-line promise, lessons and time on one line, and one tertiary button.
 * Lesson count and length show as marked placeholders until the ministry
 * supplies them. Nothing moves on hover.
 */
export function CourseCard({ course, headingLevel = 3 }: { course: Course; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const lessons = course.lessons ?? <Placeholder>[6]</Placeholder>;
  const minutes = course.minutesPerLesson ?? <Placeholder>[20]</Placeholder>;
  return (
    <li className="flex flex-col rounded-card border border-border bg-surface-raised p-5 sm:p-8">
      {/* Gold-soft with ink text, the palette's badge pairing (11.85:1). */}
      <p className="self-start rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-on-gold">
        Free
      </p>
      <Heading className="mt-4 text-xl leading-snug sm:text-2xl">{course.title}</Heading>
      <p className="mt-2 leading-relaxed text-ink-muted">{course.summary}</p>
      <p className="mt-3 whitespace-nowrap text-base text-ink">
        {lessons} lessons · {minutes} min each
      </p>
      <div className="mt-auto pt-5">
        <ButtonLink href={`/academy/${course.slug}` as Route} variant="tertiary" className="w-full sm:w-auto">
          Start this course<span className="sr-only">: {course.title}</span>
        </ButtonLink>
      </div>
    </li>
  );
}

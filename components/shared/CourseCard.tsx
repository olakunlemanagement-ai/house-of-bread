import type { Route } from "next";
import type { Course } from "@/lib/academy/types";
import { ButtonLink } from "./Button";

/**
 * A course from the catalogue: the title, its one-line promise, lessons
 * and time on one line, and one tertiary button. No price or "Free" badge
 * until pricing is decided (docs/PLACEHOLDERS.md). Lessons and the
 * average length are computed from the course's lessons (lib/academy).
 * Nothing moves on hover.
 */
export function CourseCard({
  course,
  headingLevel = 3,
}: {
  course: Course;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className="flex flex-col rounded-card border border-border bg-surface-raised p-5 sm:p-8">
      <Heading className="text-xl leading-snug sm:text-2xl">{course.title}</Heading>
      <p className="mt-2 leading-relaxed text-ink-muted">{course.summary}</p>
      <p className="mt-3 whitespace-nowrap text-base text-ink">
        {course.lessons} lessons · about {course.minutesPerLesson} min each
      </p>
      <div className="mt-auto pt-5">
        <ButtonLink href={`/academy/${course.slug}` as Route} variant="tertiary" className="w-full sm:w-auto">
          Start this course<span className="sr-only">: {course.title}</span>
        </ButtonLink>
      </div>
    </li>
  );
}

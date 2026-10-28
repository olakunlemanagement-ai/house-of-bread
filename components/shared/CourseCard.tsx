import type { Route } from "next";
import type { Course } from "@/lib/academy/types";
import { ButtonLink } from "./Button";
import { Placeholder, PlaceholderBadge } from "./Placeholder";

/**
 * A course from the catalogue: the title, its one-line promise, lessons
 * and time on one line, and one tertiary button. No price or "Free" badge
 * until pricing is decided (docs/PLACEHOLDERS.md). Lesson count and length
 * show as marked placeholders until the ministry supplies them. With
 * showStatus (the Academy), a course that has no way to join yet carries
 * its "Coming soon" badge above the title. Nothing moves on hover.
 */
export function CourseCard({
  course,
  headingLevel = 3,
  showStatus = false,
}: {
  course: Course;
  headingLevel?: 2 | 3;
  showStatus?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const lessons = course.lessons ?? <Placeholder>[6]</Placeholder>;
  const minutes = course.minutesPerLesson ?? <Placeholder>[20]</Placeholder>;
  return (
    <li className="flex flex-col rounded-card border border-border bg-surface-raised p-5 sm:p-8">
      {showStatus && course.status === "coming-soon" ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <PlaceholderBadge label="Coming soon" />
        </div>
      ) : null}
      <Heading className="text-xl leading-snug sm:text-2xl">{course.title}</Heading>
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

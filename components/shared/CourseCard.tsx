import type { Route } from "next";
import type { Course } from "@/lib/academy/types";
import { ButtonLink } from "./Button";
import { Placeholder } from "./Placeholder";

/**
 * A course from the catalogue: title, its one-line promise, then lessons,
 * time and "Free", and one button. Lesson count and length show as marked
 * placeholders until the ministry supplies them. Nothing moves on hover.
 */
export function CourseCard({ course, headingLevel = 3 }: { course: Course; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const lessons = course.lessons ?? <Placeholder>[6]</Placeholder>;
  const minutes = course.minutesPerLesson ?? <Placeholder>[20]</Placeholder>;
  return (
    <li className="flex flex-col rounded-card border border-border bg-surface-raised p-5 sm:p-8">
      <Heading className="text-xl leading-snug sm:text-2xl">{course.title}</Heading>
      <p className="mt-2 leading-relaxed text-ink-muted">{course.summary}</p>
      <p className="mt-3 text-base text-ink">
        {lessons} lessons · about {minutes} minutes each · <strong className="font-semibold">Free</strong>
      </p>
      <div className="mt-auto pt-5">
        <ButtonLink href={`/academy/${course.slug}` as Route} className="w-full sm:w-auto">
          Start this course<span className="sr-only">: {course.title}</span>
        </ButtonLink>
      </div>
    </li>
  );
}

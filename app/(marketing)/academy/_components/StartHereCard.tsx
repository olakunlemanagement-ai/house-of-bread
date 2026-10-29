import type { Route } from "next";
import { CourseStats } from "@/components/academy/CourseMeta";
import { ButtonLink } from "@/components/shared/Button";
import { ImageSlot } from "@/components/shared/ImageSlot";
import type { Course } from "@/lib/academy";

/**
 * The Start Here course, pinned beside the catalogue (below the category
 * chips on phones and tablets), so a newcomer always knows where to begin.
 */
export function StartHereCard({ course }: { course: Course }) {
  return (
    <div className="rounded-card border border-border bg-surface-raised p-3 shadow-soft">
      <ImageSlot id={course.image} compact sizes="(min-width: 1024px) 17rem, (min-width: 640px) 28rem, 100vw" />
      <div className="px-2 pb-2 pt-5">
        <p className="eyebrow">Start here</p>
        <h3 className="mt-3 text-xl leading-snug">{course.title}</h3>
        <p className="mt-2 line-clamp-3 text-base leading-relaxed text-ink-muted">{course.summary}</p>
        <CourseStats course={course} className="mt-3" />
        <ButtonLink href={`/academy/${course.slug}` as Route} size="sm" className="mt-5 w-full">
          Start this course<span className="sr-only">: {course.title}</span>
        </ButtonLink>
      </div>
    </div>
  );
}

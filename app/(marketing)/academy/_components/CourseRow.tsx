import Link from "next/link";
import type { Route } from "next";
import { CourseStats, CourseTags } from "@/components/academy/CourseMeta";
import { ProgressLabel } from "@/components/academy/ProgressLabel";
import { ImageSlot } from "@/components/shared/ImageSlot";
import type { Course } from "@/lib/academy";

/**
 * One course in the catalogue, as BibleProject's class rows, with the time
 * cost they leave out: a thumbnail on the left; on the right the Scripture
 * range, the title, a two line description, sections, lessons and time,
 * tags and the visitor's progress. The whole row opens the course (the
 * title's link covers it); like every linked card, only its edge deepens
 * on hover, nothing moves.
 */
export function CourseRow({ course }: { course: Course }) {
  return (
    <li className="relative grid grid-cols-[6.5rem_1fr] items-start gap-4 rounded-card border border-border bg-surface-raised p-3 hover:border-border-strong sm:grid-cols-[12rem_1fr] sm:gap-6 sm:p-4 xl:grid-cols-[15rem_1fr]">
      <ImageSlot
        id={course.image}
        compact
        shape="tile"
        sizes="(min-width: 1280px) 15rem, (min-width: 640px) 12rem, 6.5rem"
      />
      <div className="min-w-0 sm:py-1">
        <p className="text-sm text-ink-muted">{course.scriptureRange}</p>
        <h4 className="mt-1 text-lg leading-snug sm:text-xl">
          <Link
            href={`/academy/${course.slug}` as Route}
            className="after:absolute after:inset-0 after:rounded-card after:content-['']"
          >
            {course.title}
          </Link>
        </h4>
        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">{course.summary}</p>
        <CourseStats course={course} className="mt-2 sm:mt-3" />
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-3">
          <CourseTags tags={course.tags} />
          <ProgressLabel course={course.slug} lessons={course.lessonSlugs} />
        </div>
      </div>
    </li>
  );
}

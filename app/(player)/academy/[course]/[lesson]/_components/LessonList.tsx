import type { Route } from "next";
import Link from "next/link";
import { LessonMarker } from "@/components/academy/SectionProgress";
import { ImageSlot } from "@/components/shared/ImageSlot";
import type { Section } from "@/lib/academy";
import { formatDuration } from "@/lib/academy/navigation";

/**
 * Every lesson of the course, grouped by section (its title and round
 * image), each with its length and completion marker; the current lesson
 * is marked with aria-current and a tint pill with an inset ring.
 */
export function LessonList({ course, sections, current }: { course: string; sections: Section[]; current: string }) {
  return (
    <ol className="flex flex-col gap-5">
      {sections.map((section) => (
        <li key={section.number}>
          <div className="flex items-center gap-3 px-2">
            <span className="block size-11 shrink-0">
              <ImageSlot id={section.image} compact shape="round" sizes="2.75rem" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-deep">Section {section.number}</p>
              <h3 className="text-lg leading-snug">{section.title}</h3>
            </div>
          </div>
          <ol className="mt-2 flex flex-col gap-1">
            {section.lessons.map((lesson) => {
              const here = lesson.slug === current;
              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/academy/${course}/${lesson.slug}` as Route}
                    aria-current={here ? "page" : undefined}
                    className={`grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 rounded-tile px-3 py-2.5 ${
                      here ? "bg-tint ring-1 ring-inset ring-glyph/25" : "hover:bg-tint"
                    }`}
                  >
                    <LessonMarker course={course} lesson={lesson.slug} />
                    <span className="min-w-0">
                      <span className="block text-xs text-ink-muted">Lesson {lesson.number}</span>
                      <span className={`block leading-snug text-ink ${here ? "font-semibold" : ""}`}>{lesson.title}</span>
                    </span>
                    <span className="whitespace-nowrap text-sm text-ink-muted">{formatDuration(lesson.minutes)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}

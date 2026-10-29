import type { Route } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { Icon } from "@/components/shared/icons";
import type { Section } from "@/lib/academy";
import { count, formatDuration } from "@/lib/academy/navigation";
import { LessonMarker, SectionRing, SectionStatus } from "./SectionProgress";

/** "Lessons 1-4", or "Lesson 5" for a section of one. */
function lessonRange(section: Section): string {
  return section.firstLesson === section.lastLesson
    ? `Lesson ${section.firstLesson}`
    : `Lessons ${section.firstLesson}-${section.lastLesson}`;
}

/**
 * The Sections tab: one accordion per section, the first open. Closed, a
 * section shows its round image inside a progress ring with its status
 * under it, then "Section 1 · Lessons 1-4", the title, the description and
 * the total time. Open, a vertical timeline of its lessons: a marker (not
 * started or completed), the number, title, one line and minutes, each
 * opening the lesson. Built on details and summary, so it works without
 * script.
 */
export function SectionAccordion({ course, sections }: { course: string; sections: Section[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <li key={section.number}>
          <details open={index === 0} className="group rounded-card border border-border bg-surface-raised">
            <summary className="flex cursor-pointer list-none items-start gap-4 rounded-card p-4 outline-offset-2 hover:bg-tint/40 sm:gap-6 sm:p-6 [&::-webkit-details-marker]:hidden">
              <span className="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-24">
                <span className="relative block size-20 sm:size-24">
                  <SectionRing course={course} lessons={section.lessons.map((lesson) => lesson.slug)} />
                  <span className="absolute inset-[0.4rem] block">
                    <ImageSlot id={section.image} compact shape="round" sizes="6rem" />
                  </span>
                </span>
                <SectionStatus course={course} lessons={section.lessons.map((lesson) => lesson.slug)} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-emerald-deep">
                  Section {section.number} · {lessonRange(section)}
                </span>
                <span className="mt-1 block font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">
                  {section.title}
                </span>
                <span className="mt-2 block text-base leading-relaxed text-ink-muted">{section.description}</span>
                <span className="mt-3 block text-sm text-ink">
                  {count(section.lessons.length, "lesson")} · {formatDuration(section.minutes)}
                </span>
              </span>
              <Icon name="chevron-down" className="mt-1 size-6 shrink-0 text-glyph group-open:rotate-180" />
            </summary>
            <ol className="relative mx-4 mb-4 border-t border-border pt-2 sm:mx-6 sm:mb-6">
              {section.lessons.map((lesson, position) => (
                <li key={lesson.slug} className="relative grid grid-cols-[2rem_1fr] gap-x-4 sm:grid-cols-[2.5rem_1fr]">
                  {/* The dotted line between markers. */}
                  {position < section.lessons.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-4 top-11 w-0 border-l-2 border-dotted border-border-strong sm:left-5"
                    />
                  ) : null}
                  <span className="flex justify-center pt-5">
                    <LessonMarker course={course} lesson={lesson.slug} />
                  </span>
                  <Link
                    href={`/academy/${course}/${lesson.slug}` as Route}
                    className="my-1 grid grid-cols-[1fr_auto] items-baseline gap-x-4 rounded-tile px-3 py-3 hover:bg-tint"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm text-ink-muted">Lesson {lesson.number}</span>
                      <span className="mt-0.5 block text-lg font-semibold leading-snug text-ink">{lesson.title}</span>
                      <span className="mt-1 block text-base leading-relaxed text-ink-muted">{lesson.description}</span>
                    </span>
                    <span className="whitespace-nowrap text-sm text-ink">{lesson.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        </li>
      ))}
    </ol>
  );
}

import { count, formatDuration } from "@/lib/academy/navigation";
import type { Course, CourseTag } from "@/lib/academy";

/** "3 sections · 12 lessons · 4 hr 32 min", all computed. */
export function CourseStats({
  course,
  className = "",
}: {
  course: Pick<Course, "lessons" | "minutes"> & { sections: number };
  className?: string;
}) {
  return (
    <p className={`text-sm text-ink ${className}`}>
      {count(course.sections, "section")} · {count(course.lessons, "lesson")} · {formatDuration(course.minutes)}
    </p>
  );
}

/** A course's tags, as small tint pills. Nothing when there are none. */
export function CourseTags({ tags }: { tags: readonly CourseTag[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-emerald-deep">
          {tag}
        </li>
      ))}
    </ul>
  );
}

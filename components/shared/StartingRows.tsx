import type { Route } from "next";
import type { Course } from "@/lib/academy/types";
import { NumberedRows } from "./NumberedRows";

/**
 * "Where are you starting from?": the three numbered rows of
 * docs/RESET-BRIEF.md, screen 4, shared by Home and the Academy. Rows 01
 * and 02 open the first and second courses in the catalogue, stand-ins
 * until the ministry names the [foundations course] and the
 * [book-by-book course]. Row 03 opens Ask.
 */
export function StartingRows({ courses, className = "" }: { courses: Course[]; className?: string }) {
  const courseHref = (index: number): Route =>
    courses[index] ? (`/academy/${courses[index].slug}` as Route) : "/academy";
  return (
    <NumberedRows
      className={className}
      items={[
        {
          title: "New to the Bible.",
          text: "Start with the foundations: what the Bible is and how to read it.",
          href: courseHref(0),
          action: "Start this course",
        },
        {
          title: "You know the stories, but not how they connect.",
          text: "Go book by book and see the whole picture.",
          href: courseHref(1),
          action: "Start this course",
        },
        {
          title: "You're carrying a question.",
          text: "Ask it. You don't need to give your name.",
          href: "/ask",
          action: "Ask a question",
        },
      ]}
    />
  );
}

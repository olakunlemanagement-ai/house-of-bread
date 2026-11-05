"use client";

import type { Route } from "next";
import Link from "next/link";
import { setLessonCompleted } from "@/components/academy/progress-client";
import { ButtonLabel, buttonClasses } from "@/components/shared/Button";
import type { Advance } from "@/lib/academy/navigation";

/**
 * "Next lesson" or "Finish course": marks the lesson being left complete,
 * then navigates. The store writes at once, so the next page reads it.
 * Without script it is a plain link and marks nothing.
 */
export function AdvanceLink({ course, advance, href }: { course: string; advance: Advance; href: Route }) {
  return (
    <Link
      href={href}
      onClick={() => setLessonCompleted(course, advance.completes, true)}
      className={buttonClasses("primary", "light", "w-full sm:w-auto")}
    >
      <ButtonLabel>{advance.label}</ButtonLabel>
    </Link>
  );
}

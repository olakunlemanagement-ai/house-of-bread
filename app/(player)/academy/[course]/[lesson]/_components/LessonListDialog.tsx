"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { Button } from "@/components/shared/Button";
import { Icon } from "@/components/shared/icons";

/**
 * The centred "Lesson N · Title" in the lesson bar. A click opens every
 * lesson of the course in a modal dialog, grouped by section (the list is
 * rendered on the server and passed in). Until script runs it is a link to
 * the course page, whose Sections tab lists the same lessons. The dialog
 * element gives focus in, Esc to close and focus back; a tap on the
 * backdrop closes it too.
 */
export function LessonListDialog({
  label,
  courseHref,
  heading,
  children,
}: {
  label: string;
  courseHref: Route;
  heading: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    dialog.current?.showModal();
    // Bring the current lesson into view inside the list.
    dialog.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "center" });
  }

  return (
    <>
      <Link
        href={courseHref}
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-button px-3 text-center font-serif text-base font-semibold leading-snug text-ink hover:bg-tint sm:text-lg"
      >
        <span className="min-w-0 truncate">{label}</span>
        <Icon name="chevron-down" className="size-4 shrink-0 text-glyph" />
        <span className="sr-only">(all lessons)</span>
      </Link>
      <dialog
        ref={dialog}
        aria-labelledby="lesson-list-heading"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto max-h-[calc(100svh-2rem)] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-card bg-surface-raised p-0 text-ink shadow-raised backdrop:bg-green-night/80"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface-raised p-5 sm:p-6">
          <div className="min-w-0">
            <p className="eyebrow">Lessons</p>
            <h2 id="lesson-list-heading" className="mt-2 text-2xl leading-tight">
              {heading}
            </h2>
          </div>
          <Button variant="secondary" size="sm" onClick={() => dialog.current?.close()} className="shrink-0">
            Close
          </Button>
        </div>
        <div className="p-3 sm:p-4">{children}</div>
      </dialog>
    </>
  );
}

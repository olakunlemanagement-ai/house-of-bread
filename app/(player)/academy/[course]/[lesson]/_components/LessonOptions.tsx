"use client";

import { useEffect, useRef, useState } from "react";
import { setLessonCompleted, useCourseProgress } from "@/components/academy/progress-client";
import { ButtonLabel, buttonClasses } from "@/components/shared/Button";
import { Icon } from "@/components/shared/icons";

const item =
  "flex min-h-11 w-full items-center gap-3 rounded-tile px-3 text-left text-[0.95rem] font-medium text-ink hover:bg-tint";

/**
 * The lesson's "Options" menu (a details disclosure): Share, Mark lesson
 * complete (a toggle, aria-pressed) and Download notes when the lesson has
 * a notes file. Share and Mark need script, so they hide without it; the
 * whole menu hides then unless there are notes to download. Esc or a click
 * outside closes it. There is no Audio only: the YouTube embed has no audio
 * mode, and hiding the player while it plays breaks YouTube's terms.
 */
export function LessonOptions({
  course,
  lesson,
  title,
  notesFile,
}: {
  course: string;
  lesson: string;
  title: string;
  notesFile?: string;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const [status, setStatus] = useState("");
  const { completed } = useCourseProgress(course, [lesson]);
  const done = completed.has(lesson);

  useEffect(() => {
    const close = (event: Event) => {
      const details = menu.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        details.open = false;
        details.querySelector("summary")?.focus();
        return;
      }
      if (event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  async function share() {
    const url = window.location.href.split("?")[0];
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus("Copy the address from your browser to share this lesson.");
    }
  }

  return (
    <details ref={menu} className="relative" {...(notesFile ? {} : { "data-js-only": "" })}>
      <summary className={`${buttonClasses("secondary", "light", "list-none [&::-webkit-details-marker]:hidden", "sm")} cursor-pointer`}>
        <ButtonLabel>Options</ButtonLabel>
      </summary>
      <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-card border border-border bg-surface-raised p-2 shadow-raised">
        <ul className="flex flex-col gap-1">
          <li data-js-only>
            <button type="button" className={item} onClick={share}>
              <Icon name="share" className="size-5 shrink-0 text-glyph" />
              Share
            </button>
          </li>
          <li data-js-only>
            <button
              type="button"
              aria-pressed={done}
              className={item}
              onClick={() => setLessonCompleted(course, lesson, !done)}
            >
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-glyph ${done ? "bg-glyph text-surface-raised" : ""}`}
              >
                {done ? <Icon name="check" className="size-3" strokeWidth={3} /> : null}
              </span>
              Mark lesson complete
            </button>
          </li>
          {notesFile ? (
            <li>
              <a href={notesFile} download className={item}>
                <Icon name="scroll" className="size-5 shrink-0 text-glyph" />
                Download notes
              </a>
            </li>
          ) : null}
        </ul>
        <p role="status" className="px-3 text-sm text-ink-muted empty:hidden">
          {status}
        </p>
      </div>
    </details>
  );
}

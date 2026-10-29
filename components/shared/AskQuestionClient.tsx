"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { QUESTION_MAX, QUESTION_MIN, questionTopics, topicLabels } from "@/lib/questions/fields";
import { questionErrorMessage, questionMessages, type QuestionError } from "@/lib/questions/messages";
import { isFieldError, submitQuestion } from "@/lib/questions/submit";
import { Button, ButtonLabel, buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";
import { FormError, Honeypot, inputClass, OpensSoonNote } from "./forms";
import { Icon, IconTile } from "./icons";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; error: QuestionError };

/**
 * The button and its dialog. The button is a link to /ask until script
 * runs; then a plain click opens the dialog instead (modified clicks still
 * open /ask). The dialog element gives the modal behaviour: focus moves in
 * on open and back to the button on close, Esc closes it, and the page
 * holds still behind it (app/globals.css). A tap on the backdrop closes it
 * too. A draft survives a close; a sent question clears.
 */
export function AskQuestionClient({
  enabled,
  variant,
  size,
  className,
}: {
  enabled: boolean;
  variant: ButtonVariant;
  size: ButtonSize;
  className: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const uid = useId();
  const id = (name: string) => `ask-dialog-${uid}-${name}`;

  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    dialog.current?.showModal();
  }

  return (
    <>
      <Link href="/ask" onClick={open} aria-haspopup="dialog" className={buttonClasses(variant, "light", className, size)}>
        <ButtonLabel>Ask a question</ButtonLabel>
      </Link>

      <dialog
        ref={dialog}
        aria-labelledby={id("heading")}
        onClick={(event) => {
          // A tap on the backdrop lands on the dialog itself.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto max-h-[calc(100svh-2rem)] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-card bg-surface-raised p-0 text-ink shadow-raised backdrop:bg-green-night/80"
      >
        <AskDialogBody enabled={enabled} id={id} onClose={() => dialog.current?.close()} />
      </dialog>
    </>
  );
}

function AskDialogBody({
  enabled,
  id,
  onClose,
}: {
  enabled: boolean;
  id: (name: string) => string;
  onClose: () => void;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [length, setLength] = useState(0);
  const question = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.kind === "success") successRef.current?.focus();
    if (state.kind === "error" && isFieldError(state.error)) question.current?.focus();
  }, [state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state.kind === "submitting") return;
    const target = event.currentTarget;
    setState({ kind: "submitting" });
    const result = await submitQuestion(target);
    if (result.ok) {
      target.reset();
      setLength(0);
      setState({ kind: "success" });
    } else {
      setState({ kind: "error", error: result.error });
    }
  }

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="eyebrow">Ask anonymously</p>
        <h2 id={id("heading")} className="mt-3 text-2xl leading-tight sm:text-[1.75rem]">
          What would you like to understand?
        </h2>
      </div>
      <Button variant="secondary" size="sm" onClick={onClose} className="shrink-0">
        Close
      </Button>
    </div>
  );

  if (state.kind === "success") {
    return (
      <div className="p-5 sm:p-8">
        {header}
        <div ref={successRef} tabIndex={-1} role="status" className="mt-8 rounded-input outline-offset-4">
          <IconTile name="check" size="lg" />
          <p className="mt-6 text-xl font-semibold text-fg-heading">{questionMessages.successHeading}</p>
          <p className="mt-3 text-lg leading-relaxed text-fg">{questionMessages.success}</p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Some questions are answered in the teaching, so keep an eye on the latest videos.
          </p>
        </div>
        <div className="mt-8">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setState({ kind: "idle" })}>
            Ask another question
          </Button>
        </div>
      </div>
    );
  }

  const submitting = state.kind === "submitting";
  const error = state.kind === "error" ? state.error : null;
  const fieldError = error !== null && isFieldError(error);
  const near = length > QUESTION_MAX - 100;

  return (
    <div className="p-5 sm:p-8">
      {header}
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        A verse that puzzles you, a passage that seems to say two things, a word you want to understand.
        Ask it here. No name or email is needed.
      </p>

      <form
        action="/api/questions"
        method="post"
        onSubmit={handleSubmit}
        aria-busy={submitting}
        aria-describedby={enabled ? undefined : id("status")}
        className="relative mt-6"
      >
        <Honeypot id={id("website")} />

        <label htmlFor={id("question")} className="block font-semibold text-fg">
          Your question
        </label>
        <textarea
          ref={question}
          id={id("question")}
          name="question"
          rows={6}
          required
          minLength={QUESTION_MIN}
          maxLength={QUESTION_MAX}
          placeholder="For example: what does Jesus mean when He calls Himself the bread of life in John 6?"
          onChange={(event) => setLength(event.currentTarget.value.length)}
          aria-invalid={fieldError || undefined}
          aria-describedby={fieldError ? `${id("hint")} ${id("error")}` : id("hint")}
          className={`${inputClass("light")} mt-2 min-h-36 leading-relaxed`}
        />
        <div className="mt-2 flex items-start justify-between gap-4 text-sm leading-relaxed text-ink-muted">
          <p id={id("hint")}>Leave out names, contact details and anything private about you or anyone else.</p>
          <p aria-hidden="true" className={`shrink-0 tabular-nums ${near ? "font-semibold text-ink" : ""}`}>
            {length}/{QUESTION_MAX}
          </p>
        </div>

        <fieldset className="mt-6">
          <legend className="font-semibold text-fg">
            What is it about?<span className="ml-1 font-normal text-fg-muted">(optional)</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {questionTopics.map((topic) => (
              <label
                key={topic}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-4 text-base text-ink hover:bg-tint has-checked:border-glyph has-checked:bg-tint-strong has-checked:font-semibold has-checked:text-emerald-deep has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-emerald-deep"
              >
                <input type="radio" name="topic" value={topic} className="peer sr-only" />
                <Icon name="check" className="hidden size-4 peer-checked:block" />
                {topicLabels[topic]}
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-6 flex items-start gap-3 rounded-input bg-surface-warm px-4 py-3 text-sm leading-relaxed text-ink">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0 text-emerald-deep" />
          This form cannot reply to you or give urgent help. If you or someone else is in danger, contact your
          local emergency services.
        </p>

        {error ? (
          <div className="mt-6">
            <FormError id={id("error")}>{questionErrorMessage(error)}</FormError>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {enabled ? (
            // aria-disabled rather than disabled, so focus stays on the button while it sends.
            <Button type="submit" aria-disabled={submitting || undefined} className="w-full aria-disabled:cursor-wait sm:w-auto">
              {submitting ? "Sending..." : "Send question"}
            </Button>
          ) : (
            <>
              <Button type="submit" disabled aria-describedby={id("status")} className="w-full sm:w-auto">
                Send question
              </Button>
              <OpensSoonNote id={id("status")}>Questions open soon</OpensSoonNote>
            </>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-fg-muted">
          No name, email or phone number is asked for.{" "}
          <Link href="/privacy#questions" className="link-inline font-semibold">
            Read how anonymous questions are handled.
          </Link>
        </p>
      </form>
    </div>
  );
}

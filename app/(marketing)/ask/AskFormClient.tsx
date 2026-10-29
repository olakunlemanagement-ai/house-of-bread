"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/shared/Button";
import { Field, FormError, Honeypot, inputClass, OpensSoonNote } from "@/components/shared/forms";
import { Icon, IconTile } from "@/components/shared/icons";
import { QUESTION_MAX, QUESTION_MIN, questionTopics, topicLabels } from "@/lib/questions/fields";
import { questionErrorMessage, questionMessages, type QuestionError } from "@/lib/questions/messages";
import { isFieldError, submitQuestion } from "@/lib/questions/submit";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; error: QuestionError };

const id = (name: string) => `ask-${name}`;

/**
 * Posts to /api/questions. Without JavaScript the browser submits the form
 * itself and the route redirects. With JavaScript it submits by fetch and
 * shows the states inline. Collects the question and an optional topic,
 * nothing else.
 */
export function AskFormClient({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const successRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.kind === "success") successRef.current?.focus();
    if (state.kind === "error" && isFieldError(state.error)) questionRef.current?.focus();
  }, [state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state.kind === "submitting") return;

    const form = event.currentTarget;
    setState({ kind: "submitting" });
    const result = await submitQuestion(form);
    setState(result.ok ? { kind: "success" } : { kind: "error", error: result.error });
  }

  if (state.kind === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-2xl outline-offset-4">
        <IconTile name="check" size="lg" />
        <p className="mt-6 text-2xl font-bold text-fg-heading">{questionMessages.successHeading}</p>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-fg">{questionMessages.success}</p>
        <Button variant="secondary" className="mt-8 w-full sm:w-auto" onClick={() => setState({ kind: "idle" })}>
          Ask another question
        </Button>
      </div>
    );
  }

  const submitting = state.kind === "submitting";
  const error = state.kind === "error" ? state.error : null;
  const fieldError = error !== null && isFieldError(error);
  return (
    <form
      action="/api/questions"
      method="post"
      onSubmit={handleSubmit}
      aria-describedby={enabled ? undefined : id("status")}
      aria-busy={submitting}
      className="relative"
    >
      <Honeypot id={id("website")} />

      <AskNotice />

      <div className="mt-8 space-y-6">
        <Field id={id("question")} label="Your question">
          <p id={id("question-hint")} className="mb-3 text-base leading-relaxed text-ink-muted">
            Please do not include names, contact details or other private details about yourself or
            anyone else. Between {QUESTION_MIN} and {QUESTION_MAX} characters.
          </p>
          <textarea
            ref={questionRef}
            id={id("question")}
            name="question"
            rows={7}
            required
            minLength={QUESTION_MIN}
            maxLength={QUESTION_MAX}
            aria-invalid={fieldError || undefined}
            aria-describedby={fieldError ? `${id("question-hint")} ${id("error")}` : id("question-hint")}
            className={`${inputClass("light")} min-h-40 leading-relaxed`}
          />
        </Field>

        <Field id={id("topic")} label="Topic" hint="(optional)">
          <select id={id("topic")} name="topic" defaultValue="" className={inputClass("light")}>
            <option value="">No topic</option>
            {questionTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topicLabels[topic]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {error ? (
        <div className="mt-6">
          <FormError id={id("error")}>{questionErrorMessage(error)}</FormError>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {enabled ? (
          // aria-disabled rather than disabled, so keyboard focus stays on the
          // button while the request runs. handleSubmit ignores repeat presses.
          <Button
            type="submit"
            aria-disabled={submitting || undefined}
            className="w-full aria-disabled:cursor-wait sm:w-auto"
          >
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

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-fg-muted">
        No name, email or phone number is asked for.{" "}
        <Link href="/privacy#questions" className="link-inline font-semibold">
          Read how anonymous questions are handled.
        </Link>
      </p>
    </form>
  );
}

/** The safety notice. Ministry wording to confirm, logged in docs/PLACEHOLDERS.md. */
function AskNotice() {
  return (
    <div className="flex items-start gap-3 rounded-input border border-border bg-surface-warm px-4 py-4 text-base leading-relaxed text-ink">
      <Icon name="alert" className="mt-1 size-5 shrink-0 text-emerald-deep" />
      <p>
        This form cannot reply to you or give urgent help. If you or someone else is in danger,
        contact your local emergency services.
      </p>
    </div>
  );
}

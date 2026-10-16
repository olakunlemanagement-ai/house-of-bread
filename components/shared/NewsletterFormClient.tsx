"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { newsletterMessages } from "@/lib/newsletter/messages";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { Button } from "./Button";
import { Field, FormError, Honeypot, Input, OpensSoonNote, type FieldTone } from "./forms";
import { IconTile } from "./icons";

export type NewsletterFormClientProps = {
  idPrefix: string;
  source: NewsletterSource;
  tone: FieldTone;
  withLiveNotify: boolean;
  consent: "standard" | "short";
  /** False until Kit is configured. The form then renders disabled. */
  enabled: boolean;
};

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string; emailInvalid: boolean };

/**
 * Posts to /api/subscribe. Without JavaScript the browser submits the form
 * itself and the route redirects. With JavaScript it submits by fetch and
 * shows the states inline.
 */
export function NewsletterFormClient({
  idPrefix,
  source,
  tone,
  withLiveNotify,
  consent,
  enabled,
}: NewsletterFormClientProps) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const successRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const id = (name: string) => `${idPrefix}-${name}`;

  useEffect(() => {
    if (state.kind === "success") successRef.current?.focus();
    if (state.kind === "error" && state.emailInvalid) emailRef.current?.focus();
  }, [state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state.kind === "submitting") return;

    const data = new FormData(event.currentTarget);
    const body = {
      email: data.get("email"),
      firstName: data.get("firstName"),
      liveNotify: data.get("liveNotify") !== null,
      source: data.get("source"),
      website: data.get("website"),
    };

    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setState({ kind: "success" });
        return;
      }
      const reply: unknown = await response.json().catch(() => null);
      const emailInvalid =
        typeof reply === "object" && reply !== null && "error" in reply && reply.error === "invalid-email";
      setState({
        kind: "error",
        emailInvalid,
        message: emailInvalid ? newsletterMessages.invalidEmail : newsletterMessages.failure,
      });
    } catch {
      setState({ kind: "error", emailInvalid: false, message: newsletterMessages.failure });
    }
  }

  if (state.kind === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-2xl outline-offset-4">
        <IconTile name="check" size="lg" />
        <p className="mt-6 text-2xl font-bold text-fg-heading">{newsletterMessages.successHeading}</p>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-fg">{newsletterMessages.success}</p>
      </div>
    );
  }

  const submitting = state.kind === "submitting";
  const error = state.kind === "error" ? state : null;
  const linkClass =
    tone === "green"
      ? "font-semibold text-lime underline underline-offset-4"
      : "font-semibold text-green underline underline-offset-4";

  return (
    <form
      action="/api/subscribe"
      method="post"
      onSubmit={handleSubmit}
      aria-describedby={enabled ? undefined : id("status")}
      aria-busy={submitting}
      className="relative"
    >
      <input type="hidden" name="source" value={source} />
      <Honeypot id={id("website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("first-name")} label="First name" hint="(optional)">
          <Input
            id={id("first-name")}
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={100}
            tone={tone}
          />
        </Field>
        <Field id={id("email")} label="Email">
          <Input
            ref={emailRef}
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            required
            aria-invalid={error?.emailInvalid ? true : undefined}
            aria-describedby={error?.emailInvalid ? id("error") : undefined}
            tone={tone}
          />
        </Field>
      </div>

      {withLiveNotify ? (
        <div className="mt-5 flex items-start gap-3">
          <input
            id={id("live-notify")}
            name="liveNotify"
            type="checkbox"
            value="live-notify"
            className="mt-0.5 size-6 shrink-0 accent-green"
          />
          <label htmlFor={id("live-notify")} className="text-lg text-fg">
            Remind me before each live session
          </label>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5">
          <FormError id={id("error")}>{error.message}</FormError>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {enabled ? (
          // aria-disabled rather than disabled, so keyboard focus stays on the
          // button while the request runs. handleSubmit ignores repeat presses.
          <Button
            type="submit"
            tone={tone}
            aria-disabled={submitting || undefined}
            className="w-full aria-disabled:cursor-wait sm:w-auto"
          >
            {submitting ? "Subscribing..." : "Subscribe"}
          </Button>
        ) : (
          <>
            <Button type="submit" tone={tone} disabled aria-describedby={id("status")} className="w-full sm:w-auto">
              Subscribe
            </Button>
            <OpensSoonNote id={id("status")}>Signup opens soon</OpensSoonNote>
          </>
        )}
      </div>

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">
        {consent === "standard"
          ? "By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address, and you can unsubscribe at any time. "
          : "By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address. "}
        <Link href="/privacy" className={linkClass}>
          Read the privacy policy.
        </Link>
      </p>
    </form>
  );
}

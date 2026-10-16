import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./icons";

// Shared form field styling. On white, inputs use the tint fill with an
// ink-muted border (7.6:1). On green surfaces they are plain white, which
// stands out from every gradient stop.

export type FieldTone = "light" | "green";

export function inputClass(tone: FieldTone) {
  return `block w-full min-h-12 rounded-xl border-2 px-4 py-3 text-base text-ink placeholder:text-ink-muted ${
    tone === "green" ? "border-white bg-white" : "border-input-border bg-surface-tint"
  }`;
}

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-fg">
        {label}
        {hint ? <span className="ml-1 font-normal text-fg-muted">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function Input({ tone = "light", ...props }: ComponentProps<"input"> & { tone?: FieldTone }) {
  return <input className={inputClass(tone)} {...props} />;
}

/**
 * Honeypot. Hidden from sight and from assistive technology, skipped by the
 * tab order. People leave it empty, many bots fill it.
 */
export function Honeypot({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/**
 * A form error. The palette has no error colour, so it is a white panel with
 * ink text and an icon, which reads on white and on every green stop.
 */
export function FormError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-3 rounded-xl border-2 border-ink-muted bg-white px-4 py-3 font-semibold text-ink"
    >
      <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-green" />
      {children}
    </p>
  );
}

/** The visible note beside a form whose action is not wired up yet. */
export function OpensSoonNote({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-sm font-bold text-on-lime"
    >
      {children}
    </p>
  );
}

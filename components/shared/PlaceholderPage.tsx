import type { ReactNode } from "react";
import { PlaceholderLabel } from "./PlaceholderLabel";

type PlaceholderPageProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

/**
 * Temporary page body for stage one skeleton routes.
 * The visible label keeps placeholder text from being mistaken for final copy.
 */
export function PlaceholderPage({
  title,
  description = "Placeholder text. Final copy for this page has not been written yet.",
  children,
}: PlaceholderPageProps) {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-4 py-12">
      <PlaceholderLabel />
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-4 text-lg">{description}</p>
      {children ? <div className="mt-8">{children}</div> : null}
    </main>
  );
}

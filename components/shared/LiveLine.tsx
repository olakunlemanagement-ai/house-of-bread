import type { Route } from "next";
import { ButtonLink } from "./Button";

/**
 * The one small line about live teaching (docs/RESET-BRIEF.md, screen 5),
 * on Home and Teachings: when it runs, and a small button to the session
 * times on /events. Live meetings never get a main section.
 */
export function LiveLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5 ${className}`}>
      <p className="text-base text-ink-muted">New teaching live every Monday at 8 pm Lagos time.</p>
      <ButtonLink href={"/events#rhythm" as Route} variant="secondary" size="sm">
        See the session times
      </ButtonLink>
    </div>
  );
}

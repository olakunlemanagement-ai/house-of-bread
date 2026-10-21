import { ButtonLink } from "./Button";
import { IconTile } from "./icons";

/**
 * Invites anonymous Bible questions. A quiet mint band: question, one
 * sentence, one button to /ask. Used once on Home, directly above the
 * newsletter card. Never in the header.
 */
export function AskCta({ id = "ask" }: { id?: string }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="bg-surface-mint">
      <div className="container-page reveal flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:gap-12 md:py-20">
        <div className="flex items-start gap-5">
          <IconTile name="question" size="lg" />
          <div>
            <h2 id={headingId} className="text-h2">
              Do you have a question about the Bible?
            </h2>
            <p className="mt-3 max-w-xl text-lead text-ink-muted">Ask anonymously. No name or email needed.</p>
          </div>
        </div>
        <ButtonLink href="/ask" arrow className="w-full shrink-0 md:w-auto">
          Ask a question
        </ButtonLink>
      </div>
    </section>
  );
}

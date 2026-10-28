import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { questionMessages } from "@/lib/questions/messages";

export const metadata: Metadata = {
  title: "Question sent",
  description: questionMessages.success,
  // Never indexed. This page only makes sense straight after sending.
  robots: { index: false, follow: false },
};

/** Where a question posted without JavaScript lands. */
export default function AskSentPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <PageHeader
        loop="dust-light"
        eyebrow="Ask"
        title={questionMessages.successHeading}
        lead={questionMessages.success}
        actions={
          <>
            <ButtonLink href="/media">Watch the latest teaching</ButtonLink>
            <ButtonLink href="/ask" variant="secondary">
              Ask a question
            </ButtonLink>
          </>
        }
      />
    </main>
  );
}

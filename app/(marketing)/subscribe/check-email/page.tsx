import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { newsletterMessages } from "@/lib/newsletter/messages";

export const metadata: Metadata = {
  title: "Check your email",
  description: "A confirmation email is on its way.",
  // Never indexed, whatever the global flag says. This page only makes sense
  // straight after a signup.
  robots: { index: false, follow: false },
};

/** Where a signup posted without JavaScript lands. */
export default function CheckEmailPage() {
  return (
    // data-newsletter: the visitor has just signed up, so the footer strip stays hidden.
    <main id="main" data-newsletter tabIndex={-1} className="bg-surface">
      <PageHeader
        loop="bread-steam"
        eyebrow="Newsletter"
        title={newsletterMessages.successHeading}
        lead={newsletterMessages.success}
        actions={
          <>
            <ButtonLink href="/academy">Browse free courses</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Go home
            </ButtonLink>
          </>
        }
      />
    </main>
  );
}

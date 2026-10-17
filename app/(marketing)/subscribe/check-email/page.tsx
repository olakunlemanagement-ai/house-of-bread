import type { Metadata } from "next";
import { TextCTA } from "@/components/shared/TextCTA";
import { IconTile } from "@/components/shared/icons";
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
    <main id="main" tabIndex={-1} className="bg-surface">
      <div className="container-page py-20 md:py-32">
        <div className="max-w-2xl">
          <IconTile name="mail" size="lg" />
          <h1 className="rise-text mt-8 text-display">{newsletterMessages.successHeading}</h1>
          <p className="mt-6 text-lead text-ink">{newsletterMessages.success}</p>
          <p className="mt-10">
            <TextCTA href="/" direction="back">
              Back to the home page
            </TextCTA>
          </p>
        </div>
      </div>
    </main>
  );
}

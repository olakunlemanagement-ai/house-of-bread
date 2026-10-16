import type { Metadata } from "next";
import Link from "next/link";
import { textLinkClass } from "@/components/shared/Button";
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
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 md:py-28">
        <IconTile name="mail" size="lg" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {newsletterMessages.successHeading}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink">{newsletterMessages.success}</p>
        <p className="mt-10">
          <Link href="/" className={textLinkClass}>
            Back to the home page
          </Link>
        </p>
      </div>
    </main>
  );
}

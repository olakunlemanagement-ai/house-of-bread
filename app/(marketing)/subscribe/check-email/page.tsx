import type { Metadata } from "next";
import Link from "next/link";
import { textLinkClass } from "@/components/shared/Button";
import { IconTile } from "@/components/shared/icons";

export const metadata: Metadata = {
  title: "Check your email",
  description: "A confirmation email is on its way.",
  // Never indexed, whatever the global flag says. This page only makes sense
  // straight after a signup.
  robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 md:py-28">
        <IconTile name="mail" size="lg" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">Check your email</h1>
        <p className="mt-6 text-xl leading-relaxed text-ink">
          A confirmation email is on its way. Click the link inside to finish subscribing. If it
          does not arrive within a few minutes, check the spam or promotions folder.
        </p>
        <p className="mt-10">
          <Link href="/" className={textLinkClass}>
            Back to the home page
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

// Handles unknown URLs and notFound() calls from any route.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-4 text-lg">
          The page you were looking for does not exist or has moved.
        </p>
        <p className="mt-8">
          <Link href="/" className="text-link underline underline-offset-4">
            Go to the home page
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

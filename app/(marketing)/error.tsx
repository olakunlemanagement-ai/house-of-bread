"use client";

import Link from "next/link";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-lg">
        This page could not be shown. Please try again.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded bg-accent px-4 py-2 font-semibold text-on-accent"
        >
          Try again
        </button>
        <Link href="/" className="px-1 py-2 text-link underline underline-offset-4">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}

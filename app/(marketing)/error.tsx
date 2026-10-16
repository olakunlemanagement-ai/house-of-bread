"use client";

import { Button, ButtonLink } from "@/components/shared/Button";
import { IconTile } from "@/components/shared/icons";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <IconTile name="question" size="lg" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">Something went wrong</h1>
        <p className="mt-6 text-xl leading-relaxed text-ink">
          The page could not load. Try again, and if the problem continues, contact the ministry.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button onClick={() => retry()}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Go home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}

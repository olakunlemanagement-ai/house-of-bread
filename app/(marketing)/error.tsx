"use client";

import { Button, ButtonLink } from "@/components/shared/Button";
import { IconTile } from "@/components/shared/icons";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <div className="container-page pb-20 pt-38 md:pb-32 md:pt-50">
        <div className="max-w-3xl">
          <IconTile name="alert" size="lg" />
          <h1 className="mt-8 text-display">Something went wrong</h1>
          <p className="mt-6 text-lead text-ink">
            The page could not load. Try again, and if the problem continues, contact the ministry.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={() => retry()} arrow className="w-full sm:w-auto">
              Try again
            </Button>
            <ButtonLink href="/" variant="secondary" className="w-full sm:w-auto">
              Go home
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}

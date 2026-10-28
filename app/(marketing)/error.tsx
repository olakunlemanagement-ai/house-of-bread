"use client";

import { Button, ButtonLink } from "@/components/shared/Button";
import { heroBodyClass, heroFrameClass } from "@/components/shared/HeroBackdrop";
import { IconTile } from "@/components/shared/icons";

// No loop here, but the same full screen frame as every hero, so the
// transparent header sits over clear space.
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" tabIndex={-1} className={heroFrameClass}>
      <div className={`${heroBodyClass} flex flex-col justify-center`}>
        <div className="max-w-3xl">
          <IconTile name="alert" size="lg" />
          <h1 className="mt-8 text-display">Something went wrong</h1>
          <p className="mt-6 text-lead text-ink">
            The page could not load. Try again, and if the problem continues, send a message through the Contact page.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={() => retry()} className="w-full sm:w-auto">
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

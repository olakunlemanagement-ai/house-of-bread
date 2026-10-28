import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { buttonClasses } from "@/components/shared/Button";
import { ThemeToggle } from "@/components/shared/theme/ThemeToggle";
import "./buttons.css";

// A preview for choosing the site's button style (28 October 2026). Not in
// the sitemap or the nav, never indexed, and a 404 on the production
// deployment. Delete this route once a style is chosen and built into
// components/shared/Button.tsx.
export const metadata: Metadata = {
  title: "Button options (preview)",
  robots: { index: false, follow: false },
};

type Variant = "primary" | "secondary" | "tertiary";

const options: {
  key: "a" | "b" | "c";
  name: string;
  summary: string;
  classes: Record<Variant, string>;
}[] = [
  {
    key: "a",
    name: "A. Bookplate",
    summary:
      "Literata in small caps, letter spaced, on a 3px radius. A fine hairline sits 3px inside the edge, like the double rule of a bookplate. Hover shifts the fill.",
    classes: { primary: "bo-aPrimary", secondary: "bo-aSecondary", tertiary: "bo-aTertiary" },
  },
  {
    key: "b",
    name: "B. Ruled",
    summary:
      "Literata in sentence case on a 2px radius, edged with one 1px hairline. On hover a fine rule draws out beneath the label from its centre.",
    classes: { primary: "bo-bPrimary", secondary: "bo-bSecondary", tertiary: "bo-bTertiary" },
  },
  {
    key: "c",
    name: "C. Engraved",
    summary:
      "Geist in small caps with wide tracking on a 6px radius, an inset hairline inside the outline. On hover a deeper fill sweeps in from the left.",
    classes: { primary: "bo-cPrimary", secondary: "bo-cSecondary", tertiary: "bo-cTertiary" },
  },
];

const labels: Record<Variant, string> = {
  primary: "Browse courses",
  secondary: "Watch the latest teaching",
  tertiary: "Start this course",
};

function OptionButton({
  option,
  variant,
  force,
  size = "md",
  disabled = false,
  children,
}: {
  option: (typeof options)[number];
  variant: Variant;
  force?: "hover" | "press";
  size?: "md" | "sm";
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-force={force}
      className={`bo-base bo-${option.key} ${option.classes[variant]} ${size === "sm" ? "bo-sm" : ""}`}
    >
      <span className="bo-label">{children}</span>
    </button>
  );
}

const bands = [
  { name: "White", className: "bg-surface" },
  { name: "Cream band", className: "bg-surface-warm" },
  { name: "Mint band", className: "bg-surface-mint" },
];

export default function ButtonOptionsPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <main id="main" className="min-h-svh bg-surface pb-24">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8">
        <div>
          <p className="eyebrow">Preview, not linked</p>
          <h1 className="mt-2 text-display">Button options</h1>
          <p className="mt-3 max-w-2xl text-lead text-ink-muted">
            Three classic styles, each with primary, secondary and tertiary on every surface, then their
            hover, press and disabled states. Switch the theme to compare dark.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <section aria-labelledby="current-heading" className="container-page pb-10">
        <h2 id="current-heading" className="text-xl">
          Current (pills, for reference)
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={buttonClasses("primary")}>Browse courses</span>
          <span className={buttonClasses("secondary")}>Watch the latest teaching</span>
          <span className={buttonClasses("tertiary", "light", "", "sm")}>Start this course</span>
        </div>
      </section>

      {options.map((option) => (
        <section key={option.key} aria-labelledby={`option-${option.key}`} className="border-t border-border">
          <div className="container-page pt-12">
            <h2 id={`option-${option.key}`} className="text-h2">
              {option.name}
            </h2>
            <p className="mt-3 max-w-2xl text-ink-muted">{option.summary}</p>
          </div>
          <div className="mt-8">
            {bands.map((band) => (
              <div key={band.name} className={band.className}>
                <div className="container-page flex flex-col gap-4 py-6 sm:flex-row sm:flex-wrap sm:items-center">
                  <p className="w-28 shrink-0 text-sm text-ink-muted">{band.name}</p>
                  <OptionButton option={option} variant="primary">
                    {labels.primary}
                  </OptionButton>
                  <OptionButton option={option} variant="secondary">
                    {labels.secondary}
                  </OptionButton>
                  <OptionButton option={option} variant="tertiary" size="sm">
                    {labels.tertiary}
                  </OptionButton>
                </div>
              </div>
            ))}
            <div className="container-page grid gap-4 py-6 sm:grid-cols-[7rem_1fr] sm:items-center">
              <p className="text-sm text-ink-muted">Hover</p>
              <div className="flex flex-wrap items-center gap-4">
                {(["primary", "secondary", "tertiary"] as const).map((variant) => (
                  <OptionButton key={variant} option={option} variant={variant} force="hover" size={variant === "tertiary" ? "sm" : "md"}>
                    {labels[variant]}
                  </OptionButton>
                ))}
              </div>
              <p className="text-sm text-ink-muted">Press</p>
              <div className="flex flex-wrap items-center gap-4">
                {(["primary", "secondary", "tertiary"] as const).map((variant) => (
                  <OptionButton key={variant} option={option} variant={variant} force="press" size={variant === "tertiary" ? "sm" : "md"}>
                    {labels[variant]}
                  </OptionButton>
                ))}
              </div>
              <p className="text-sm text-ink-muted">Disabled</p>
              <div className="flex flex-wrap items-center gap-4">
                <OptionButton option={option} variant="primary" disabled>
                  Subscribe
                </OptionButton>
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

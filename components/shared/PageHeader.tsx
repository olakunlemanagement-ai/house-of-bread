import type { CSSProperties, ReactNode } from "react";
import type { LoopId } from "@/lib/media/loops";
import { HeroBackdrop, heroBodyClass, heroFrameClass } from "./HeroBackdrop";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Extra lines under the lead, such as dates or passage chips. */
  meta?: ReactNode;
  /** Buttons. Full width and stacked on mobile. */
  actions?: ReactNode;
  /** Optional visual on the right on desktop, below on mobile. Sits on a solid surface of its own. */
  visual?: ReactNode;
  /** The loop behind this hero. Each page picks one (docs/PLACEHOLDERS.md, "Hero loop per page"). */
  loop: LoopId;
  /** Play the loop's phone crop on phones. The Academy only; other pages show the poster there. */
  phoneLoop?: boolean;
  /**
   * "night": a dark overlay across the whole hero, in both themes, with the
   * dark palette's text (`.tone-night` in app/globals.css). The header over
   * it takes the same tokens. About only.
   */
  tone?: "default" | "night";
  /** "center": the text centred across the hero, with no visual beside it. */
  align?: "start" | "center";
  /** Eyebrow, title and lead smooth in once on load (`.smooth-in`). Motion On only. */
  animate?: boolean;
};

const delay = (ms: number) => ({ "--smooth-delay": `${ms}ms` }) as CSSProperties;

/**
 * Opens every inner page as a hero, like Home: it fills the first screen
 * with the header over its top (heroFrameClass), the page's loop moving
 * behind the text (HeroBackdrop), a hairline below. By default the text
 * sits in the left seven columns, inside the scrim's full strength, centred
 * in the screen below the header. A night hero holds its dark scrim across
 * the full width, so centred text stays on it everywhere.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  actions,
  visual,
  loop,
  phoneLoop = false,
  tone = "default",
  align = "start",
  animate = false,
}: PageHeaderProps) {
  const night = tone === "night";
  const center = align === "center";
  const smooth = animate ? "smooth-in" : "";
  const stagger = (ms: number) => (animate ? delay(ms) : undefined);
  return (
    <div
      data-hero-tone={night ? "night" : undefined}
      className={`${heroFrameClass} border-b border-border ${night ? "tone-night" : ""}`}
    >
      <HeroBackdrop loop={loop} phone={phoneLoop} hold={night ? 100 : undefined} />
      <div className={`${heroBodyClass} grid content-center items-center gap-12 lg:grid-cols-12`}>
        <div data-hero-text className={center ? "text-center lg:col-span-12" : "lg:col-span-7"}>
          <p className={`eyebrow eyebrow-dot ${smooth}`} style={stagger(0)}>
            {eyebrow}
          </p>
          <h1
            className={`mt-5 max-w-3xl text-display ${center ? "mx-auto font-semibold" : ""} ${smooth}`}
            style={stagger(120)}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className={`mt-5 max-w-2xl text-lead ${center ? "mx-auto font-semibold text-ink" : "text-ink-muted"} ${smooth}`}
              style={stagger(260)}
            >
              {lead}
            </p>
          ) : null}
          {meta ? <div className="mt-6">{meta}</div> : null}
          {actions ? (
            <div
              className={`mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto ${center ? "sm:justify-center" : ""}`}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {visual && !center ? <div className="lg:col-span-5">{visual}</div> : null}
      </div>
    </div>
  );
}

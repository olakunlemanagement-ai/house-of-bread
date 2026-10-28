import type { WeeklyRule } from "@/lib/schedule/weekly";
import { NextSessionTime } from "./NextSessionTime";

/**
 * Home's app section visual, restored from before the reset (eef0617): a
 * phone drawn in CSS, open at John 6 in the King James Version with verse
 * 35 highlighted, and two floating cards. Illustrative, not a screenshot
 * (TODO: real screenshots once the app developer supplies them).
 * The progress card ("30 Day NT Journey, Day 1 of 30") is part of the
 * illustration. The "Next live session" card is real: the next weekly
 * session from the schedule (lib/schedule), cached on the server and
 * corrected by the visitor's clock, so it is text, not part of the image.
 * The floating cards keep their glass look (glass-card, globals.css), the
 * one allowed exception to the header-only translucency rule: light glass
 * holds AA over the green-night phone frame, dark glass over white.
 */
export function AppMockup({ rule, nextSessionIso }: { rule: WeeklyRule; nextSessionIso: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] py-6">
      <div
        role="img"
        aria-label="Illustration of the House of Bread app open at John chapter 6 in the King James Version, verse 35 highlighted, with a 30 Day NT Journey card showing Day 1 of 30"
      >
        <div aria-hidden="true" className="relative">
          <PhoneFrame className="mx-auto" />
          {/* Illustrative progress card over the phone's lower right. */}
          <div className={`${floating} bottom-10 right-0 w-48 sm:-right-4 sm:w-56`}>
            <p className="font-serif text-base font-semibold leading-snug text-emerald-deep">30 Day NT Journey</p>
            <p className="mt-1 text-sm text-ink-muted">Day 1 of 30</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-mint">
              <div className="h-full w-[8%] rounded-full bg-glyph" />
            </div>
          </div>
        </div>
      </div>
      {/* The real next session, over the phone's upper left. */}
      <div className={`${floating} left-0 top-16 w-48 sm:-left-6 sm:w-60`}>
        <p className="eyebrow eyebrow-dot leading-tight">Next live session</p>
        <p className="mt-3 font-serif text-base font-semibold leading-snug text-emerald-deep">Live teaching</p>
        <p className="mt-1 text-xs leading-snug text-ink-muted">
          <NextSessionTime rule={rule} serverIso={nextSessionIso} />
        </p>
      </div>
    </div>
  );
}

const floating = "glass-card absolute z-10 rounded-tile border border-(--glass-border) p-4";

/** The phone, drawn in CSS: the app's reading screen at John 6 (KJV), verses 33 to 35. */
function PhoneFrame({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full max-w-[16rem] sm:max-w-[17rem] ${className}`}>
      <div className="rounded-[2.6rem] border-[10px] border-green-night bg-green-night shadow-(--phone-shadow)">
        <div className="overflow-hidden rounded-[1.9rem] bg-surface">
          <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-green-night/80" />
          <div className="mt-2 flex items-center justify-between bg-emerald px-5 pb-3 pt-3 text-on-green">
            <span className="font-serif text-sm font-semibold">John 6</span>
            <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[0.65rem] font-bold text-emerald-deep">
              KJV
            </span>
          </div>
          <div className="space-y-3 px-5 py-5 font-serif text-[0.8rem] leading-relaxed text-ink">
            <p>
              <sup className="mr-1 font-sans font-bold text-emerald-deep">33</sup>
              For the bread of God is he which cometh down from heaven, and giveth life unto the world.
            </p>
            <p>
              <sup className="mr-1 font-sans font-bold text-emerald-deep">34</sup>
              Then said they unto him, Lord, evermore give us this bread.
            </p>
            <p className="rounded-lg bg-surface-mint p-2 ring-1 ring-inset ring-glyph/30">
              <sup className="mr-1 font-sans font-bold text-emerald-deep">35</sup>
              And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger;
              and he that believeth on me shall never thirst.
            </p>
          </div>
          <div className="mx-5 mb-6 h-1.5 overflow-hidden rounded-full bg-surface-mint">
            <div className="h-full w-2/5 rounded-full bg-glyph" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Literata } from "next/font/google";
import type { CSSProperties } from "react";

// Literata's Greek glyphs, for the one Greek word. Loaded here rather than
// in the root layout, so no other page carries it, and never preloaded.
const greek = Literata({ subsets: ["greek"], weight: ["500"], preload: false, display: "swap" });

const HEADWORD = "Didaskalos";
const GREEK = "διδάσκαλος";

const at = (ms: number) => ({ "--smooth-delay": `${ms}ms` }) as CSSProperties;
const letterAt = (index: number) => ({ "--letter": index }) as CSSProperties;

/**
 * About's hero, set as a dictionary entry: the headword and its Greek, the
 * pronunciation, part of speech and Strong's number on one small line, a
 * fine rule, then the numbered sense. It writes itself in once on load:
 * the headword letter by letter (`.letter-rise`), the Greek and the
 * details smoothing in (`.smooth-in`), the rule drawing out from the
 * centre (`.rule-draw`) and the definition written out left to right
 * (`.write-on`). CSS only (app/globals.css), so it ends visible without
 * JavaScript; none of it runs under Motion Off or reduced motion. Screen
 * readers get the whole word at once, not letter by letter.
 */
export function DictionaryEntry() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mt-5 font-serif text-display-lg font-semibold">
        <span className="sr-only">
          Didaskalos (<span lang="grc">{GREEK}</span>)
        </span>
        <span aria-hidden="true" className="block">
          {[...HEADWORD].map((letter, index) => (
            <span key={index} className="letter-rise inline-block" style={letterAt(index)}>
              {letter}
            </span>
          ))}
        </span>
        <span
          aria-hidden="true"
          lang="grc"
          className={`${greek.className} smooth-in mt-2 block text-[0.55em] font-medium leading-tight text-ink-muted`}
          style={at(700)}
        >
          ({GREEK})
        </span>
      </h1>

      <p
        className="smooth-in mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-base text-ink-muted"
        style={at(950)}
      >
        <span className="font-serif italic">di-DAS-ka-los</span>
        <span aria-hidden="true">·</span>
        <span className="font-serif italic">noun, masculine</span>
        {/* On phones the source takes its own line, so no separator is left hanging. */}
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <span className="basis-full sm:basis-auto">Koine Greek, Strong&apos;s G1320</span>
      </p>

      <span aria-hidden="true" className="rule-draw mx-auto mt-6 block h-px w-24 bg-glyph" style={at(1150)} />

      <p className="write-on mx-auto mt-6 max-w-3xl text-left text-lead-lg font-semibold text-ink sm:text-center" style={at(1250)}>
        <span className="mr-2 font-serif text-emerald-deep">1.</span>
        an ancient Greek word that translates to &ldquo;teacher&rdquo; or &ldquo;master,&rdquo; most commonly used in
        historical and biblical contexts to denote an instructor of spiritual or philosophical truth.
      </p>
    </div>
  );
}

export type FlagCode = "gb" | "gh" | "ke" | "ng" | "us" | "za";

// National flags from lipis/flag-icons (MIT, see docs/CREDITS.md), the 4:3
// SVGs copied unchanged into public/flags. Shown as images, so they render on
// every system (Windows has no flag emoji), each file is cached once, and
// their internal ids can never collide. Decorative: the country name always
// sits beside them as text. A faint outline keeps white edges visible on white.

/** A national flag, 4:3. Pass a width class (w-6 to w-10); the height follows. */
export function Flag({ code, className = "w-6" }: { code: FlagCode; className?: string }) {
  return (
    // A plain img: SVG needs no optimiser, and these are a few hundred bytes each.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code}.svg`}
      alt=""
      aria-hidden="true"
      width={24}
      height={18}
      decoding="async"
      className={`h-auto shrink-0 rounded-[2px] shadow-[0_0_0_1px_var(--flag-edge)] ${className}`}
    />
  );
}

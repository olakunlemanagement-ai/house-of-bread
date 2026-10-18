import type { ReactNode, SVGProps } from "react";

// Simple stroke icons, drawn inline so no icon package ships to the browser.
// Always decorative: the text beside an icon carries the meaning.

export type IconName =
  | "book"
  | "route"
  | "scroll"
  | "globe"
  | "live"
  | "calendar"
  | "people"
  | "phone"
  | "mail"
  | "check"
  | "arrow-right"
  | "arrow-left"
  | "question"
  | "compass"
  | "cross"
  | "search"
  | "alert"
  | "bell"
  | "clock"
  | "layers"
  | "signal"
  | "type"
  | "swipe"
  | "pin"
  | "play"
  | "share"
  | "heart"
  | "headphones"
  | "video"
  | "pause"
  | "resume";

const paths: Record<IconName, ReactNode> = {
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 21H20" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
    </>
  ),
  scroll: (
    <>
      <path d="M8 3h11v14a3 3 0 0 1-3 3H6" />
      <path d="M8 3a2 2 0 0 0-2 2v13a2 2 0 1 1-2-2h2" />
      <path d="M11 8h5M11 12h5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  live: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M10 9.5v5l4.5-2.5z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M18 20a6 6 0 0 0-2.5-4.9" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  cross: <path d="M12 3v18M7 8h10" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  signal: <path d="M5 19v-3M10 19v-6M15 19v-9M20 19V5" />,
  type: <path d="M5 6V4h14v2M12 4v16M9 20h6" />,
  swipe: (
    <>
      <path d="M4 12h12M12 8l4 4-4 4" />
      <path d="M20 5v14" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9v6l5-3z" fill="currentColor" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z" />
  ),
  headphones: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="14" height="14" rx="2.5" />
      <path d="m17 10 4-2.5v9L17 14" />
    </>
  ),
  pause: <path d="M9 6v12M15 6v12" />,
  resume: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
};

export function Icon({
  name,
  className = "size-5",
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

/**
 * Icon inside a rounded square, leaf to emerald, white glyph. White on leaf
 * is 3.43:1, enough for a glyph (3:1) but not for small text, so text tiles
 * use solid emerald instead.
 */
export function IconTile({
  name,
  size = "md",
}: {
  name: IconName;
  size?: "sm" | "md" | "lg";
}) {
  const box = { sm: "size-9 rounded-xl", md: "size-12 rounded-tile", lg: "size-16 rounded-tile" }[size];
  const icon = { sm: "size-4", md: "size-6", lg: "size-8" }[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-tint text-emerald ring-1 ring-inset ring-emerald/10 ${box}`}
    >
      <Icon name={name} className={icon} />
    </span>
  );
}

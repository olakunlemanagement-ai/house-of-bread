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
  | "search";

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

/** Icon inside a rounded square with a green gradient fill. */
export function IconTile({
  name,
  glyph = "lime",
  size = "md",
}: {
  name: IconName;
  glyph?: "lime" | "white";
  size?: "sm" | "md" | "lg";
}) {
  const box = { sm: "size-9 rounded-lg", md: "size-12 rounded-xl", lg: "size-16 rounded-2xl" }[size];
  const icon = { sm: "size-4", md: "size-6", lg: "size-8" }[size];
  return (
    <span
      className={`bg-green-tile inline-flex shrink-0 items-center justify-center ${box} ${
        glyph === "lime" ? "text-lime" : "text-white"
      }`}
    >
      <Icon name={name} className={icon} />
    </span>
  );
}

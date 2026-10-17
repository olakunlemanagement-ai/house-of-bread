import { useId } from "react";
import type { SocialPlatform } from "@/lib/site-config";

// Brand marks as inline SVG on a 24 unit grid, in brand colours. Shown on a
// white tile, so every glyph keeps at least 3:1 against white (measured in
// scripts/check-contrast.mjs). Linktree's own green is too light on white,
// so its mark uses a darkened Linktree green.

export const platformName: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
  linktree: "Linktree",
};

const TIKTOK =
  "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

export function SocialIcon({ platform, className = "size-5" }: { platform: SocialPlatform; className?: string }) {
  const gradientId = useId();
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: false, className } as const;

  switch (platform) {
    case "instagram":
      return (
        <svg {...common}>
          <defs>
            <radialGradient id={gradientId} cx="0.3" cy="1.07" r="1.2">
              <stop offset="0" stopColor="#fdbb2d" />
              <stop offset="0.25" stopColor="#f56040" />
              <stop offset="0.55" stopColor="#d62976" />
              <stop offset="0.85" stopColor="#962fbf" />
              <stop offset="1" stopColor="#4f5bd5" />
            </radialGradient>
          </defs>
          <g fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.2">
            <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" />
            <circle cx="12" cy="12" r="4.4" />
          </g>
          <circle cx="17.4" cy="6.6" r="1.35" fill={`url(#${gradientId})`} />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path
            fill="#ff0000"
            d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5z"
          />
          <path fill="#ffffff" d="M9.6 15.6 15.8 12 9.6 8.4z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="12" fill="#0866ff" />
          <path
            fill="#ffffff"
            d="M13.4 24v-8.4h2.8l.5-3.4h-3.3V10c0-.9.4-1.8 1.9-1.8h1.5V5.3s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.7v2.4H6.5v3.4h3V24z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path fill="#25f4ee" d={TIKTOK} transform="translate(-0.7 -0.5) scale(0.96)" />
          <path fill="#fe2c55" d={TIKTOK} transform="translate(1.2 1.1) scale(0.96)" />
          <path fill="#000000" d={TIKTOK} transform="translate(0.25 0.3) scale(0.96)" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path
            fill="#000000"
            d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"
          />
        </svg>
      );
    case "linktree":
      return (
        <svg {...common}>
          <path
            fill="#1e7a35"
            d="m13.74 5.85 4-4.12 2.33 2.38-4.2 4h5.9v3.31h-5.93l4.22 4.1-2.32 2.34L12 12.1l-5.74 5.77-2.33-2.33 4.23-4.1H2.23V8.12h5.9l-4.2-4 2.33-2.39 4 4.12V0h3.48zm-3.48 10.3h3.48V24h-3.48z"
          />
        </svg>
      );
  }
}

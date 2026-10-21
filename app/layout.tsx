import type { Metadata, Viewport } from "next";
import { Geist, Literata } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { THEME_COLOR, themeScript } from "@/components/shared/theme/theme-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Serif for long reading and scripture. Latin only: 500 for display, 600 for small headings.
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: siteConfig.noindex
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

// Both themes are supported. The browser chrome follows the system; an
// explicit choice rewrites both colours (components/shared/theme).
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The head script adds data-js and data-theme before hydration, hence suppressHydrationWarning.
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${geistSans.variable} ${literata.variable} h-full antialiased`}
    >
      <head>
        {/* Sets the theme before first paint, so the wrong theme never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

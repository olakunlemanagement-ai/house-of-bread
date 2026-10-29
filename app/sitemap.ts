import type { MetadataRoute } from "next";
import { getAll } from "@/lib/content";
import { placeholderPlans } from "@/lib/content/placeholder-data";
import { siteConfig } from "@/lib/site-config";
import { seriesParams, watchParams } from "@/lib/youtube/teachings";

// Public, indexable pages only. /subscribe/check-email, /ask/sent and the 404
// page are permanently noindex and left out. No lastModified until content
// carries real dates. The global noindex flag in siteConfig still applies
// until launch.
const staticPaths = [
  "/",
  "/about",
  "/academy",
  "/media",
  "/media/all",
  "/media/series",
  "/events",
  "/teachings",
  "/new-testament",
  "/plans",
  "/app",
  "/subscribe",
  "/subscribe/academy",
  "/ask",
  "/contact",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Teachings: every long-form teaching, episode and series the catalog holds (lib/youtube).
  const [videos, series] = await Promise.all([watchParams(), seriesParams()]);
  const paths = [
    ...staticPaths,
    ...getAll("class").map((entry) => `/academy/${entry.slug}`),
    ...getAll("event").map((entry) => `/events/${entry.slug}`),
    ...getAll("teaching").map((entry) => `/teachings/${entry.slug}`),
    ...getAll("book").map((entry) => `/new-testament/${entry.slug}`),
    ...placeholderPlans.map((entry) => `/plans/${entry.slug}`),
    ...videos.map((id) => `/media/watch/${id}`),
    ...series.map((id) => `/media/series/${id}`),
  ];
  return paths.map((path) => ({ url: new URL(path, siteConfig.url).toString() }));
}

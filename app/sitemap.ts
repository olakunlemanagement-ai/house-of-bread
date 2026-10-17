import type { MetadataRoute } from "next";
import { getAll } from "@/lib/content";
import { placeholderPlans } from "@/lib/content/placeholder-data";
import { siteConfig } from "@/lib/site-config";

// Public, indexable pages only. /subscribe/check-email and the 404 page are
// permanently noindex and left out. No lastModified until content carries
// real dates. The global noindex flag in siteConfig still applies until launch.
const staticPaths = [
  "/",
  "/about",
  "/academy",
  "/media",
  "/events",
  "/teachings",
  "/new-testament",
  "/plans",
  "/app",
  "/subscribe",
  "/contact",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...getAll("class").map((entry) => `/academy/${entry.slug}`),
    ...getAll("event").map((entry) => `/events/${entry.slug}`),
    ...getAll("teaching").map((entry) => `/teachings/${entry.slug}`),
    ...getAll("book").map((entry) => `/new-testament/${entry.slug}`),
    ...placeholderPlans.map((entry) => `/plans/${entry.slug}`),
  ];
  return paths.map((path) => ({ url: new URL(path, siteConfig.url).toString() }));
}

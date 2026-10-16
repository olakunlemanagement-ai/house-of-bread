import type { NewsletterSource } from "./schema";

// Server only. Never import this from a client component: it reads the Kit
// API key.

export type KitConfig = {
  apiKey: string;
  formId: string;
  liveNotifyTagId?: string;
  sourceTagIds: Partial<Record<NewsletterSource, string>>;
};

const sourceTagEnv: Record<NewsletterSource, string> = {
  footer: "KIT_TAG_SOURCE_FOOTER",
  "subscribe-page": "KIT_TAG_SOURCE_SUBSCRIBE_PAGE",
  "live-notify": "KIT_TAG_SOURCE_LIVE_NOTIFY",
  "plan-page": "KIT_TAG_SOURCE_PLAN_PAGE",
};

function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/**
 * Kit settings from the environment, or null when the API key or form id is
 * missing. Tags are optional: a missing tag id skips that tag.
 */
export function getKitConfig(): KitConfig | null {
  const apiKey = read("KIT_API_KEY");
  const formId = read("KIT_FORM_ID");
  if (!apiKey || !formId) return null;

  const sourceTagIds: KitConfig["sourceTagIds"] = {};
  for (const [source, envName] of Object.entries(sourceTagEnv) as [NewsletterSource, string][]) {
    const id = read(envName);
    if (id) sourceTagIds[source] = id;
  }

  return { apiKey, formId, liveNotifyTagId: read("KIT_TAG_LIVE_NOTIFY"), sourceTagIds };
}

/**
 * Whether signup is open. Pages are static, so this is read at build time:
 * setting the variables in Vercel needs a redeploy to enable the forms.
 */
export function isNewsletterEnabled(): boolean {
  return getKitConfig() !== null;
}

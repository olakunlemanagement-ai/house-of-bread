import type { ResendConfig } from "@/lib/mail/resend";

// Server only. Never import this from a client component: it reads the
// Resend API key.

export type QuestionsConfig = ResendConfig & { to: string };

function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** Resend settings for questions, or null when any variable is missing. */
export function getQuestionsConfig(): QuestionsConfig | null {
  const apiKey = read("RESEND_API_KEY");
  const from = read("RESEND_FROM");
  const to = read("QUESTIONS_TO_EMAIL");
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

/**
 * Whether the question form is open. Pages are static, so this is read at
 * build time: setting the variables in Vercel needs a redeploy.
 */
export function isQuestionsEnabled(): boolean {
  return getQuestionsConfig() !== null;
}

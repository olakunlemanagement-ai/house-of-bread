// The seam between the website and the House of Bread app (SPEC-v3 section
// 9, CLAUDE.md section 5). Not used at launch. Framework free.

/** One reading plan's progress, read only, as the app would report it. */
export interface PlanProgress {
  planSlug: string;
  currentDay: number;
  totalDays: number;
  streak: number;
  lastActiveAt: string; // ISO 8601
}

declare const appSessionBrand: unique symbol;

/**
 * A signed in visitor's session with the app. Deliberately opaque: its shape
 * depends on how the website will sign in against the app (OAuth or OIDC,
 * the app's hosted auth provider, or a signed handoff link), which is an
 * open item in SPEC-v3 section 9. Do not invent it before that is decided.
 */
export type AppSession = { readonly [appSessionBrand]: true };

/** Reads a visitor's reading plan progress from the app. Server side only. */
export interface ProgressProvider {
  getProgress(session: AppSession): Promise<PlanProgress[]>;
}

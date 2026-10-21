import "server-only";
import { NoopProgressProvider } from "./noop.ts";
import type { ProgressProvider } from "./types.ts";

// NOT USED AT LAUNCH. No page, component or route imports this module yet.
//
// Every future call to the House of Bread app goes through here, on the
// server, so no app credential or token reaches the browser. Swap the
// provider below for a real one once the app's backend, sign in method and
// API shape are agreed with the app developer (SPEC-v3 section 9). Scope is
// read only, with the visitor's explicit consent. Do not add user tables,
// sessions or auth routes until the spec stage calls for them.

/** The progress source the website reads. A no-op until the app link is built. */
export const progressProvider: ProgressProvider = new NoopProgressProvider();

export { NoopProgressProvider } from "./noop.ts";
export type { AppSession, PlanProgress, ProgressProvider } from "./types.ts";

import type { PlanProgress, ProgressProvider } from "./types.ts";

/**
 * The launch provider: there is no app link yet, so every visitor has no
 * progress. Makes no network calls and ignores the session.
 */
export class NoopProgressProvider implements ProgressProvider {
  async getProgress(): Promise<PlanProgress[]> {
    return [];
  }
}

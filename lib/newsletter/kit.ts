import type { KitConfig } from "./config";
import type { SubscribeInput } from "./schema";

// Kit API v4 client. Server only.
// Docs: https://developers.kit.com/api-reference
//
// Double opt-in flow:
// 1. Create the subscriber as `inactive`. The endpoint is an upsert: an
//    existing subscriber keeps their state and only the first name changes,
//    so a returning address is never reactivated or duplicated.
// 2. Add them to the form. A form with double opt-in turned on sends its
//    confirmation (incentive) email, and Kit activates the subscriber when
//    they click it. An address already on the form is not emailed again.
// 3. Apply the source tag, and the live-notify tag if asked for.

const KIT_API = "https://api.kit.com/v4";
const TIMEOUT_MS = 8000;

export type KitStep = "create-subscriber" | "add-to-form" | "tag";

/** A failed Kit call. Carries the step and status only, never the address. */
export class KitError extends Error {
  constructor(
    readonly step: KitStep,
    readonly status: number | null,
  ) {
    super(`Kit ${step} failed${status === null ? " (unreachable)" : ` with status ${status}`}`);
    this.name = "KitError";
  }
}

async function post(config: KitConfig, step: KitStep, path: string, body: object) {
  let response: Response;
  try {
    response = await fetch(`${KIT_API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Kit-Api-Key": config.apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new KitError(step, null);
  }
  // 200 means it already existed, 201 means created. Both are success.
  if (!response.ok) throw new KitError(step, response.status);
}

/** Tag ids to apply for this signup, without duplicates. */
export function tagIdsFor(input: SubscribeInput, config: KitConfig): string[] {
  const ids = new Set<string>();
  const sourceTag = config.sourceTagIds[input.source];
  if (sourceTag) ids.add(sourceTag);
  if ((input.liveNotify || input.source === "live-notify") && config.liveNotifyTagId) {
    ids.add(config.liveNotifyTagId);
  }
  return [...ids];
}

/**
 * Subscribes an address with double opt-in. Throws KitError if the subscriber
 * cannot be created or added to the form. Tag failures do not throw: the
 * signup itself succeeded, and they are returned so the caller can log them.
 */
export async function subscribeToKit(
  input: SubscribeInput,
  config: KitConfig,
): Promise<{ tagFailures: KitError[] }> {
  const email_address = input.email;

  // first_name is only sent when given, because the upsert would otherwise
  // clear the name of an existing subscriber.
  await post(config, "create-subscriber", "/subscribers", {
    email_address,
    ...(input.firstName ? { first_name: input.firstName } : {}),
    state: "inactive",
  });

  await post(config, "add-to-form", `/forms/${encodeURIComponent(config.formId)}/subscribers`, {
    email_address,
  });

  const results = await Promise.allSettled(
    tagIdsFor(input, config).map((tagId) =>
      post(config, "tag", `/tags/${encodeURIComponent(tagId)}/subscribers`, { email_address }),
    ),
  );
  const tagFailures = results.flatMap((result) =>
    result.status === "rejected" && result.reason instanceof KitError ? [result.reason] : [],
  );
  return { tagFailures };
}

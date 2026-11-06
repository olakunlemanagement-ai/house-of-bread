import { afterEach, describe, expect, it, vi } from "vitest";
import type { KitConfig } from "./config";
import { KIT_DEADLINE_MS, KitError, subscribeToKit } from "./kit";

const config: KitConfig = {
  apiKey: "test-key",
  formId: "111",
  sourceTagIds: { footer: "222" },
  liveNotifyTagId: "333",
};

const input: Parameters<typeof subscribeToKit>[0] = { email: "reader@example.com", source: "footer", liveNotify: true };

/** A fake Kit that answers each call after `delayMs`, unless the request is aborted first. */
function slowKit(delayMs: number) {
  const calls: string[] = [];
  vi.stubGlobal("fetch", (url: string, init: RequestInit) => {
    calls.push(url);
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => resolve(new Response("{}", { status: 201 })), delayMs);
      init.signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(init.signal?.reason);
      });
    });
  });
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the Kit signup deadline", () => {
  it("stays under the 10 s function limit", () => {
    expect(KIT_DEADLINE_MS).toBeLessThan(10_000);
  });

  it("covers every call together, not each call on its own", async () => {
    // Each call takes 40 ms; four calls need 160 ms, but the whole signup has 100 ms.
    const calls = slowKit(40);
    const started = Date.now();
    const error = await subscribeToKit(input, config, 100).catch((caught: unknown) => caught);
    const elapsed = Date.now() - started;
    // Cut off during the tags at the latest: create and add-to-form fit in 80 ms.
    if (error instanceof KitError) {
      expect(error.status).toBeNull();
    } else {
      expect(error).toEqual({ tagFailures: [expect.any(KitError), expect.any(KitError)] });
    }
    expect(calls.length).toBeLessThanOrEqual(4);
    expect(elapsed).toBeLessThan(160);
  });

  it("fails as unreachable when Kit stalls before the subscriber is created", async () => {
    slowKit(1000);
    const started = Date.now();
    await expect(subscribeToKit(input, config, 50)).rejects.toEqual(new KitError("create-subscriber", null));
    expect(Date.now() - started).toBeLessThan(500);
  });

  it("completes normally when Kit answers in time", async () => {
    const calls = slowKit(1);
    await expect(subscribeToKit(input, config, 1000)).resolves.toEqual({ tagFailures: [] });
    expect(calls).toHaveLength(4);
  });
});

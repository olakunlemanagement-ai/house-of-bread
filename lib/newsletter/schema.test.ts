import { afterEach, describe, expect, it, vi } from "vitest";
import { getKitConfig } from "./config";
import { subscribePageSource, subscribeSchema } from "./schema";

describe("newsletter sources", () => {
  it("accepts academy-waitlist as a signup source", () => {
    const result = subscribeSchema.safeParse({ email: "reader@example.com", source: "academy-waitlist" });
    expect(result.success).toBe(true);
  });

  it("lets a link set the academy-waitlist source on /subscribe", () => {
    expect(subscribePageSource("academy-waitlist")).toBe("academy-waitlist");
  });

  it("falls back to subscribe-page for a missing, unknown or repeated ?source=", () => {
    expect(subscribePageSource(undefined)).toBe("subscribe-page");
    expect(subscribePageSource("")).toBe("subscribe-page");
    expect(subscribePageSource("footer")).toBe("subscribe-page");
    expect(subscribePageSource("elsewhere")).toBe("subscribe-page");
    expect(subscribePageSource(["academy-waitlist", "footer"])).toBe("subscribe-page");
  });
});

describe("Kit source tags", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("maps KIT_TAG_SOURCE_ACADEMY_WAITLIST to the academy-waitlist source", () => {
    vi.stubEnv("KIT_API_KEY", "key");
    vi.stubEnv("KIT_FORM_ID", "1");
    vi.stubEnv("KIT_TAG_SOURCE_ACADEMY_WAITLIST", "555");
    expect(getKitConfig()?.sourceTagIds["academy-waitlist"]).toBe("555");
  });

  it("skips the academy-waitlist tag when its id is not set", () => {
    vi.stubEnv("KIT_API_KEY", "key");
    vi.stubEnv("KIT_FORM_ID", "1");
    vi.stubEnv("KIT_TAG_SOURCE_ACADEMY_WAITLIST", "");
    expect(getKitConfig()?.sourceTagIds["academy-waitlist"]).toBeUndefined();
  });
});

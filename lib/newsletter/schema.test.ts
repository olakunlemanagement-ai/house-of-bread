import { afterEach, describe, expect, it, vi } from "vitest";
import { getKitConfig } from "./config";
import { subscribeSchema } from "./schema";

describe("newsletter sources", () => {
  it("accepts academy-waitlist as a signup source", () => {
    const result = subscribeSchema.safeParse({ email: "reader@example.com", source: "academy-waitlist" });
    expect(result.success).toBe(true);
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

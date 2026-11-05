import { describe, expect, it } from "vitest";
import { isCrossSitePost } from "./origin";

function post(headers: Record<string, string>) {
  return new Request("https://hobglobal.online/api/subscribe", { method: "POST", headers });
}

describe("isCrossSitePost", () => {
  it("trusts Sec-Fetch-Site when the browser sends it", () => {
    expect(isCrossSitePost(post({ "sec-fetch-site": "cross-site" }))).toBe(true);
    expect(isCrossSitePost(post({ "sec-fetch-site": "same-origin" }))).toBe(false);
    expect(isCrossSitePost(post({ "sec-fetch-site": "same-site" }))).toBe(false);
    expect(isCrossSitePost(post({ "sec-fetch-site": "none" }))).toBe(false);
  });

  it("falls back to comparing Origin", () => {
    expect(isCrossSitePost(post({ origin: "https://hobglobal.online" }))).toBe(false);
    expect(isCrossSitePost(post({ origin: "https://evil.example" }))).toBe(true);
    expect(isCrossSitePost(post({ origin: "not a url" }))).toBe(true);
  });

  it("lets a post with no usable Origin through", () => {
    expect(isCrossSitePost(post({}))).toBe(false);
    expect(isCrossSitePost(post({ origin: "null" }))).toBe(false);
  });
});

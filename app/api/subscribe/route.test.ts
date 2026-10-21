import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newsletterMessages } from "@/lib/newsletter/messages";
import { POST } from "./route";

// Kit is mocked at the fetch boundary, so the real client code runs.

const EMAIL = "reader@example.com";
const KIT_ENV = {
  KIT_API_KEY: "test-key",
  KIT_FORM_ID: "111",
  KIT_TAG_LIVE_NOTIFY: "222",
  KIT_TAG_SOURCE_FOOTER: "333",
  KIT_TAG_SOURCE_SUBSCRIBE_PAGE: "444",
  KIT_TAG_SOURCE_ACADEMY_WAITLIST: "555",
};

type KitCall = { url: string; body: Record<string, unknown>; apiKey: string | null };

let kitCalls: KitCall[];
let errorLog: ReturnType<typeof vi.spyOn>;

/** Replaces fetch with a fake Kit that answers each call with `status`. */
function mockKit(status: number | ((url: string) => number)) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      const headers = new Headers(init?.headers);
      kitCalls.push({
        url,
        body: JSON.parse(String(init?.body)) as Record<string, unknown>,
        apiKey: headers.get("X-Kit-Api-Key"),
      });
      const code = typeof status === "function" ? status(url) : status;
      return Response.json({}, { status: code });
    }),
  );
}

function jsonRequest(body: unknown) {
  return new Request("https://hobglobal.online/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function formRequest(fields: Record<string, string>) {
  return new Request("https://hobglobal.online/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  });
}

function loggedText() {
  return JSON.stringify(errorLog.mock.calls);
}

beforeEach(() => {
  kitCalls = [];
  for (const [name, value] of Object.entries(KIT_ENV)) vi.stubEnv(name, value);
  errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/subscribe", () => {
  it("subscribes a valid address with double opt-in and tags", async () => {
    mockKit(201);
    const response = await POST(
      jsonRequest({ email: ` ${EMAIL} `, firstName: "Ada", liveNotify: true, source: "subscribe-page" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    expect(kitCalls.map((call) => call.url)).toEqual([
      "https://api.kit.com/v4/subscribers",
      "https://api.kit.com/v4/forms/111/subscribers",
      "https://api.kit.com/v4/tags/444/subscribers",
      "https://api.kit.com/v4/tags/222/subscribers",
    ]);
    expect(kitCalls[0].body).toEqual({ email_address: EMAIL, first_name: "Ada", state: "inactive" });
    expect(kitCalls.every((call) => call.apiKey === "test-key")).toBe(true);
  });

  it("applies the Academy waitlist tag to an academy-waitlist signup", async () => {
    mockKit(201);
    const response = await POST(jsonRequest({ email: EMAIL, source: "academy-waitlist" }));

    expect(response.status).toBe(200);
    expect(kitCalls.map((call) => call.url)).toEqual([
      "https://api.kit.com/v4/subscribers",
      "https://api.kit.com/v4/forms/111/subscribers",
      "https://api.kit.com/v4/tags/555/subscribers",
    ]);
  });

  it("redirects a plain form post to the check email page with 303", async () => {
    mockKit(201);
    const response = await POST(formRequest({ email: EMAIL, source: "footer", website: "" }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://hobglobal.online/subscribe/check-email");
    expect(kitCalls).toHaveLength(3);
  });

  it("rejects an invalid email without calling Kit", async () => {
    mockKit(201);
    const response = await POST(jsonRequest({ email: "not-an-email", source: "footer" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: "invalid-email",
      message: newsletterMessages.invalidEmail,
    });
    expect(kitCalls).toHaveLength(0);
  });

  it("sends a form post with an invalid email back to /subscribe", async () => {
    mockKit(201);
    const response = await POST(formRequest({ email: "nope", source: "footer" }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://hobglobal.online/subscribe?error=email#signup",
    );
  });

  it("rejects an unknown source", async () => {
    mockKit(201);
    const response = await POST(jsonRequest({ email: EMAIL, source: "elsewhere" }));

    expect(response.status).toBe(400);
    expect(kitCalls).toHaveLength(0);
  });

  it("answers a filled honeypot with the normal success and does nothing else", async () => {
    mockKit(201);
    const json = await POST(jsonRequest({ email: EMAIL, source: "footer", website: "spam.example" }));
    const form = await POST(formRequest({ email: "junk", source: "footer", website: "spam.example" }));

    expect(json.status).toBe(200);
    expect(await json.json()).toEqual({ ok: true });
    expect(form.status).toBe(303);
    expect(form.headers.get("location")).toBe("https://hobglobal.online/subscribe/check-email");
    expect(kitCalls).toHaveLength(0);
  });

  it("gives an existing address the same success response", async () => {
    mockKit(201);
    const fresh = await POST(jsonRequest({ email: EMAIL, source: "footer" }));
    mockKit(200);
    const existing = await POST(jsonRequest({ email: EMAIL, source: "footer" }));

    expect(existing.status).toBe(fresh.status);
    expect(await existing.json()).toEqual(await fresh.json());
  });

  it("returns a retry message and logs without the address when Kit fails", async () => {
    mockKit(500);
    const response = await POST(jsonRequest({ email: EMAIL, source: "footer" }));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, error: "retry", message: newsletterMessages.failure });
    expect(errorLog).toHaveBeenCalled();
    expect(loggedText()).not.toContain(EMAIL);
  });

  it("returns a retry message when Kit is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("fetch failed"))));
    const response = await POST(formRequest({ email: EMAIL, source: "footer" }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://hobglobal.online/subscribe?error=retry#signup",
    );
    expect(loggedText()).not.toContain(EMAIL);
  });

  it("still succeeds when only tagging fails, and logs it without the address", async () => {
    mockKit((url) => (url.includes("/tags/") ? 404 : 201));
    const response = await POST(jsonRequest({ email: EMAIL, source: "footer" }));

    expect(response.status).toBe(200);
    expect(errorLog).toHaveBeenCalled();
    expect(loggedText()).not.toContain(EMAIL);
  });

  it("returns a retry message without calling Kit when the environment is not set", async () => {
    vi.stubEnv("KIT_API_KEY", "");
    mockKit(201);
    const response = await POST(jsonRequest({ email: EMAIL, source: "footer" }));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, error: "retry" });
    expect(kitCalls).toHaveLength(0);
    expect(loggedText()).not.toContain(EMAIL);
  });

  it("rejects an unsupported content type", async () => {
    const response = await POST(
      new Request("https://hobglobal.online/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: EMAIL,
      }),
    );
    expect(response.status).toBe(415);
  });
});

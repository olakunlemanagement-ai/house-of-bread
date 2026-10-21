import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QUESTION_SUBJECT } from "@/lib/questions/email";
import { questionMessages } from "@/lib/questions/messages";
import { POST } from "./route";

// Resend is mocked at the fetch boundary, so the real client code runs.

const ENV = {
  RESEND_API_KEY: "re_test",
  RESEND_FROM: "House of Bread Global <questions@hobglobal.online>",
  QUESTIONS_TO_EMAIL: "inbox@hobglobal.online",
};
const QUESTION = "What does it mean that Jesus is the bread of life?";
const IP = "203.0.113.42";
const AGENT = "TestAgent/1.0 (unique-agent-marker)";

type SendCall = { url: string; body: Record<string, unknown>; auth: string | null };

let sendCalls: SendCall[];
let logSpies: ReturnType<typeof vi.spyOn>[];

function mockResend(status: number | "network-error") {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL, init?: RequestInit) => {
      sendCalls.push({
        url: String(input),
        body: JSON.parse(String(init?.body)) as Record<string, unknown>,
        auth: new Headers(init?.headers).get("Authorization"),
      });
      if (status === "network-error") throw new TypeError("fetch failed");
      return Response.json({ id: "abc" }, { status });
    }),
  );
}

function clearEnv() {
  vi.unstubAllEnvs();
  for (const name of Object.keys(ENV)) vi.stubEnv(name, "");
}

// Requests carry the headers a real visitor's would, so the tests can show
// they go nowhere.
const identifying = { "x-forwarded-for": IP, "x-real-ip": IP, "user-agent": AGENT };

function request(contentType: string, body: string) {
  return new Request("https://hobglobal.online/api/questions", {
    method: "POST",
    headers: { "Content-Type": contentType, ...identifying },
    body,
  });
}

const jsonRequest = (body: unknown) => request("application/json", JSON.stringify(body));
const formRequest = (fields: Record<string, string>) =>
  request("application/x-www-form-urlencoded", new URLSearchParams(fields).toString());

beforeEach(() => {
  sendCalls = [];
  for (const [name, value] of Object.entries(ENV)) vi.stubEnv(name, value);
  logSpies = (["error", "log", "info", "warn", "debug"] as const).map((level) =>
    vi.spyOn(console, level).mockImplementation(() => {}),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/questions", () => {
  it("sends the question as plain text through Resend", async () => {
    mockResend(200);
    const response = await POST(jsonRequest({ question: QUESTION, topic: "doctrine", website: "" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sendCalls).toHaveLength(1);
    const [call] = sendCalls;
    expect(call.url).toBe("https://api.resend.com/emails");
    expect(call.auth).toBe("Bearer re_test");
    expect(Object.keys(call.body).sort()).toEqual(["from", "subject", "text", "to"]);
    expect(call.body.from).toBe(ENV.RESEND_FROM);
    expect(call.body.to).toEqual([ENV.QUESTIONS_TO_EMAIL]);
    expect(call.body.subject).toBe(QUESTION_SUBJECT);
    expect(call.body.text).toContain("Topic: Doctrine");
    expect(call.body.text).toContain(QUESTION);
  });

  it("puts no IP address, user agent or other identifier in the email", async () => {
    mockResend(200);
    await POST(jsonRequest({ question: QUESTION }));

    const sent = JSON.stringify(sendCalls[0].body);
    expect(sent).not.toContain(IP);
    expect(sent).not.toContain("unique-agent-marker");
    expect(sent).not.toMatch(/reply_to|headers|"cc"|"bcc"/i);
  });

  it("keeps user input out of the subject and headers", async () => {
    mockResend(200);
    await POST(jsonRequest({ question: "Subject: hijack\nBcc: x@example.com is this allowed?" }));

    expect(sendCalls[0].body.subject).toBe(QUESTION_SUBJECT);
    expect(Object.keys(sendCalls[0].body).sort()).toEqual(["from", "subject", "text", "to"]);
  });

  it("redirects a plain form post to the sent page with 303", async () => {
    mockResend(200);
    const response = await POST(formRequest({ question: QUESTION, topic: "", website: "" }));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://hobglobal.online/ask/sent");
    expect(sendCalls).toHaveLength(1);
  });

  it("answers a filled honeypot with the normal success and sends nothing", async () => {
    mockResend(200);
    const json = await POST(jsonRequest({ question: QUESTION, website: "spam.example" }));
    const form = await POST(formRequest({ question: QUESTION, website: "spam.example" }));

    expect(json.status).toBe(200);
    expect(await json.json()).toEqual({ ok: true });
    expect(form.headers.get("location")).toBe("https://hobglobal.online/ask/sent");
    expect(sendCalls).toHaveLength(0);
  });

  it("rejects a question with more than one link", async () => {
    mockResend(200);
    const response = await POST(jsonRequest({ question: "Look at https://a.example and https://b.example" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "too-many-links",
      message: questionMessages.tooManyLinks,
    });
    expect(sendCalls).toHaveLength(0);
  });

  it("rejects short and long questions, and sends a form post back with the error", async () => {
    mockResend(200);
    const short = await POST(jsonRequest({ question: "Why?" }));
    const long = await POST(jsonRequest({ question: "a".repeat(1001) }));
    const missing = await POST(jsonRequest({}));
    const form = await POST(formRequest({ question: "Why?" }));

    expect(await short.json()).toMatchObject({ error: "too-short" });
    expect(await long.json()).toMatchObject({ error: "too-long" });
    expect(await missing.json()).toMatchObject({ error: "too-short" });
    expect(form.status).toBe(303);
    expect(form.headers.get("location")).toBe("https://hobglobal.online/ask?error=too-short#ask-form");
    expect(sendCalls).toHaveLength(0);
  });

  it("rejects an unknown topic, malformed JSON and other content types", async () => {
    mockResend(200);
    const topic = await POST(jsonRequest({ question: QUESTION, topic: "politics" }));
    const malformed = await POST(request("application/json", "{not json"));
    const plain = await POST(request("text/plain", QUESTION));

    expect(await topic.json()).toMatchObject({ error: "invalid" });
    expect(malformed.status).toBe(400);
    expect(plain.status).toBe(415);
    expect(sendCalls).toHaveLength(0);
  });

  it("rejects an oversized body", async () => {
    mockResend(200);
    const response = await POST(jsonRequest({ question: QUESTION, padding: "x".repeat(9000) }));

    expect(response.status).toBe(400);
    expect(sendCalls).toHaveLength(0);
  });

  it("returns a generic retry and sends nothing when the environment is missing", async () => {
    clearEnv();
    mockResend(200);
    const response = await POST(jsonRequest({ question: QUESTION }));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: "retry", message: questionMessages.failure });
    expect(sendCalls).toHaveLength(0);
  });

  it.each([500, 422, "network-error"] as const)("returns a generic retry when Resend fails (%s)", async (status) => {
    mockResend(status);
    const response = await POST(jsonRequest({ question: QUESTION }));

    expect(response.status).toBe(503);
    const reply: unknown = await response.json();
    expect(reply).toEqual({ ok: false, error: "retry", message: questionMessages.failure });
    expect(JSON.stringify(reply)).not.toMatch(/resend|status|re_test/i);
  });

  it("never logs the question, the IP address, the user agent or the key", async () => {
    mockResend(500);
    await POST(jsonRequest({ question: QUESTION }));
    clearEnv();
    await POST(jsonRequest({ question: QUESTION }));

    expect(logSpies[0]).toHaveBeenCalledTimes(2);
    const logged = JSON.stringify(logSpies.map((spy) => spy.mock.calls));
    expect(logged).not.toContain("bread of life");
    expect(logged).not.toContain(IP);
    expect(logged).not.toContain("unique-agent-marker");
    expect(logged).not.toContain("re_test");
  });
});

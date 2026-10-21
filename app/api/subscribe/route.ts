import { getKitConfig } from "@/lib/newsletter/config";
import { KitError, subscribeToKit } from "@/lib/newsletter/kit";
import { newsletterMessages } from "@/lib/newsletter/messages";
import { HONEYPOT_FIELD, subscribeSchema, type NewsletterSource } from "@/lib/newsletter/schema";

// Newsletter signup. Accepts JSON from the enhanced form, and plain form
// posts so signup works without JavaScript. Form posts get a 303 redirect,
// JSON gets a JSON reply.
//
// Rate limiting is a Vercel Firewall rule on this path (docs/PLACEHOLDERS.md).
// Never log the email address.

const MAX_BODY_BYTES = 8 * 1024;

type Mode = "json" | "form";
type Outcome = "success" | "invalid-email" | "invalid" | "retry";

const status: Record<Outcome, number> = {
  success: 200,
  "invalid-email": 400,
  invalid: 400,
  retry: 503,
};

/**
 * Where a form post that fails goes back to, so the visitor returns to the
 * same form, with the same fixed source. Every other source uses /subscribe.
 */
const signupPages: Partial<Record<NewsletterSource, string>> = {
  "academy-waitlist": "/subscribe/academy",
};

function signupPageFor(body: Record<string, unknown> | null): string {
  const source = body?.source;
  return (typeof source === "string" && signupPages[source as NewsletterSource]) || "/subscribe";
}

function respond(request: Request, mode: Mode, outcome: Outcome, page = "/subscribe"): Response {
  if (mode === "form") {
    const target =
      outcome === "success"
        ? "/subscribe/check-email"
        : `${page}?error=${outcome === "invalid-email" ? "email" : "retry"}#signup`;
    return Response.redirect(new URL(target, request.url), 303);
  }
  if (outcome === "success") return Response.json({ ok: true }, { status: 200 });
  return Response.json(
    {
      ok: false,
      error: outcome,
      message:
        outcome === "invalid-email" ? newsletterMessages.invalidEmail : newsletterMessages.failure,
    },
    { status: status[outcome] },
  );
}

function modeOf(request: Request): Mode | null {
  const type = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type === "application/json") return "json";
  if (type === "application/x-www-form-urlencoded") return "form";
  return null;
}

function parseBody(text: string, mode: Mode): Record<string, unknown> | null {
  if (mode === "form") return Object.fromEntries(new URLSearchParams(text));
  try {
    const value: unknown = JSON.parse(text);
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const mode = modeOf(request);
  if (!mode) {
    return Response.json({ ok: false, error: "unsupported-media-type" }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return respond(request, mode, "invalid");

  let text: string;
  try {
    text = await request.text();
  } catch {
    return respond(request, mode, "invalid");
  }
  if (text.length > MAX_BODY_BYTES) return respond(request, mode, "invalid");

  const body = parseBody(text, mode);
  if (!body) return respond(request, mode, "invalid");
  const page = signupPageFor(body);

  // A filled honeypot gets the normal success reply and nothing else, so a
  // bot learns nothing.
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return respond(request, mode, "success");
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    const emailInvalid = parsed.error.issues.some((issue) => issue.path[0] === "email");
    return respond(request, mode, emailInvalid ? "invalid-email" : "invalid", page);
  }

  const config = getKitConfig();
  if (!config) {
    console.error("[newsletter] signup rejected: Kit environment variables are not set");
    return respond(request, mode, "retry", page);
  }

  try {
    const { tagFailures } = await subscribeToKit(parsed.data, config);
    for (const failure of tagFailures) {
      console.error("[newsletter] tagging failed", { step: failure.step, status: failure.status });
    }
  } catch (error) {
    if (error instanceof KitError) {
      console.error("[newsletter] Kit request failed", { step: error.step, status: error.status });
    } else {
      console.error("[newsletter] unexpected error during signup");
    }
    return respond(request, mode, "retry", page);
  }

  // Same reply whether the address is new or already subscribed.
  return respond(request, mode, "success");
}

import { ResendError, sendPlainEmail } from "@/lib/mail/resend";
import { getQuestionsConfig } from "@/lib/questions/config";
import { buildQuestionEmail } from "@/lib/questions/email";
import { questionErrorMessage, type QuestionError } from "@/lib/questions/messages";
import { HONEYPOT_FIELD } from "@/lib/questions/fields";
import { questionSchema } from "@/lib/questions/schema";

// Anonymous Bible questions. Accepts JSON from the enhanced form, and plain
// form posts so it works without JavaScript. Form posts get a 303 redirect,
// JSON gets a JSON reply.
//
// Rate limiting is a Vercel Firewall rule on this path (docs/PLACEHOLDERS.md).
// Never log the question text, the IP address or any request header. User
// input goes into the email body only, never a header or the subject.

const MAX_BODY_BYTES = 8 * 1024;

type Mode = "json" | "form";
type Outcome = "success" | QuestionError;

function respond(request: Request, mode: Mode, outcome: Outcome): Response {
  if (mode === "form") {
    const target = outcome === "success" ? "/ask/sent" : `/ask?error=${outcome}#ask-form`;
    return Response.redirect(new URL(target, request.url), 303);
  }
  if (outcome === "success") return Response.json({ ok: true }, { status: 200 });
  return Response.json(
    { ok: false, error: outcome, message: questionErrorMessage(outcome) },
    { status: outcome === "retry" ? 503 : 400 },
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

/** The first schema problem with the question text, as a known error code. */
function errorOf(issues: { path: PropertyKey[]; message: string }[]): QuestionError {
  const issue = issues.find((item) => item.path[0] === "question");
  if (issue?.message === "too-short" || issue?.message === "too-long" || issue?.message === "too-many-links") {
    return issue.message;
  }
  return issue ? "too-short" : "invalid";
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

  // A filled honeypot gets the normal success reply and nothing is sent.
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return respond(request, mode, "success");
  }

  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) return respond(request, mode, errorOf(parsed.error.issues));

  const config = getQuestionsConfig();
  if (!config) {
    console.error("[questions] rejected: Resend environment variables are not set");
    return respond(request, mode, "retry");
  }

  try {
    await sendPlainEmail(config, buildQuestionEmail(parsed.data, config.to));
  } catch (error) {
    console.error("[questions] send failed", {
      status: error instanceof ResendError ? error.status : "unexpected",
    });
    return respond(request, mode, "retry");
  }

  return respond(request, mode, "success");
}

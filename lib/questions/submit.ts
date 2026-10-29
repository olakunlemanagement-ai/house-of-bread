// Sends a question to /api/questions from the browser. Shared by the Ask
// page's form and the Ask dialog on Home and About. No Zod here: the route
// validates, and this file stays small in the client bundle.

import { isQuestionError, type QuestionError } from "./messages";

export type QuestionResult = { ok: true } | { ok: false; error: QuestionError };

/** Errors about the text itself, which point at the question field. */
export const isFieldError = (error: QuestionError) =>
  error === "too-short" || error === "too-long" || error === "too-many-links";

/** Posts the form's question, topic and honeypot as JSON. Never throws. */
export async function submitQuestion(form: HTMLFormElement): Promise<QuestionResult> {
  const data = new FormData(form);
  const body = { question: data.get("question"), topic: data.get("topic"), website: data.get("website") };
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) return { ok: true };
    const reply: unknown = await response.json().catch(() => null);
    const error =
      typeof reply === "object" && reply !== null && "error" in reply && isQuestionError(reply.error)
        ? reply.error
        : "retry";
    return { ok: false, error };
  } catch {
    return { ok: false, error: "retry" };
  }
}

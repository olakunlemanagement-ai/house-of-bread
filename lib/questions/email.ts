import type { PlainEmail } from "@/lib/mail/resend";
import { topicLabels } from "./fields";
import type { QuestionInput } from "./schema";

/** Fixed. Never built from user input. */
export const QUESTION_SUBJECT = "New anonymous Bible question";

/**
 * The email the ministry receives: a timestamp, the topic and the question.
 * Nothing about the sender, because nothing about the sender is collected.
 */
export function buildQuestionEmail(input: QuestionInput, to: string, now: Date = new Date()): PlainEmail {
  const topic = input.topic ? topicLabels[input.topic] : "Not given";
  const text = [
    `Received: ${now.toISOString().replace("T", " ").slice(0, 16)} UTC`,
    `Topic: ${topic}`,
    "",
    "Question:",
    input.question,
    "",
    "Sent anonymously from the Ask a question form on hobglobal.online. It cannot be replied to.",
  ].join("\n");
  return { to, subject: QUESTION_SUBJECT, text };
}

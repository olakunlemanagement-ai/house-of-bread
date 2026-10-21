// User facing copy for the question form, shared by the route handler and
// the form.

export const questionMessages = {
  tooShort: "Please write at least 10 characters.",
  tooLong: "Please keep the question to 1000 characters or fewer.",
  tooManyLinks: "Please include no more than one link.",
  invalid: "The question could not be sent. Check it and try again.",
  failure: "Something went wrong. Please try again in a moment.",
  successHeading: "Thank you, your question has been sent",
  success: "It reached the ministry without your name or any contact details.",
} as const;

export type QuestionError = "too-short" | "too-long" | "too-many-links" | "invalid" | "retry";

export function questionErrorMessage(error: QuestionError): string {
  switch (error) {
    case "too-short":
      return questionMessages.tooShort;
    case "too-long":
      return questionMessages.tooLong;
    case "too-many-links":
      return questionMessages.tooManyLinks;
    case "invalid":
      return questionMessages.invalid;
    case "retry":
      return questionMessages.failure;
  }
}

export const questionErrors: readonly QuestionError[] = [
  "too-short",
  "too-long",
  "too-many-links",
  "invalid",
  "retry",
];

export function isQuestionError(value: unknown): value is QuestionError {
  return typeof value === "string" && (questionErrors as readonly string[]).includes(value);
}

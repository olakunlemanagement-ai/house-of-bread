// Field names, limits and topics for the question form. No Zod here, so the
// client form can import it without pulling the schema into the browser.

export const QUESTION_MIN = 10;
export const QUESTION_MAX = 1000;
/** More links than this and the question is rejected as likely spam. */
export const MAX_LINKS = 1;

export const questionTopics = ["scripture", "doctrine", "christian-living", "other"] as const;
export type QuestionTopic = (typeof questionTopics)[number];

export const topicLabels: Record<QuestionTopic, string> = {
  scripture: "Scripture",
  doctrine: "Doctrine",
  "christian-living": "Christian living",
  other: "Other",
};

/** Name of the hidden field people leave empty and many bots fill. */
export const HONEYPOT_FIELD = "website";

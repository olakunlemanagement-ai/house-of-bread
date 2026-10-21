import { describe, expect, it } from "vitest";
import { buildQuestionEmail, QUESTION_SUBJECT } from "./email";
import { countLinks, questionSchema } from "./schema";

const firstMessage = (input: unknown) => {
  const result = questionSchema.safeParse(input);
  return result.success ? null : result.error.issues[0].message;
};

describe("questionSchema", () => {
  it("accepts a question with no topic", () => {
    const result = questionSchema.safeParse({ question: "  What does John 6:35 mean?  " });
    expect(result.success && result.data).toEqual({ question: "What does John 6:35 mean?", topic: undefined });
  });

  it("treats an empty topic as none and accepts every listed topic", () => {
    expect(questionSchema.safeParse({ question: "a".repeat(10), topic: "" }).success).toBe(true);
    for (const topic of ["scripture", "doctrine", "christian-living", "other"]) {
      expect(questionSchema.safeParse({ question: "a".repeat(10), topic }).success).toBe(true);
    }
  });

  it("rejects a topic that is not listed", () => {
    expect(questionSchema.safeParse({ question: "a".repeat(10), topic: "politics" }).success).toBe(false);
  });

  it("holds the question to 10 to 1000 characters after trimming", () => {
    expect(firstMessage({ question: "  short    " })).toBe("too-short");
    expect(firstMessage({ question: "a".repeat(9) })).toBe("too-short");
    expect(firstMessage({ question: "a".repeat(10) })).toBeNull();
    expect(firstMessage({ question: "a".repeat(1000) })).toBeNull();
    expect(firstMessage({ question: "a".repeat(1001) })).toBe("too-long");
  });

  it("counts CRLF as one character and strips control characters", () => {
    const result = questionSchema.safeParse({ question: "Line one\r\nline two\u0000" });
    expect(result.success && result.data.question).toBe("Line one\nline two");
  });

  it("allows one link and rejects two", () => {
    expect(firstMessage({ question: "No links in this question at all." })).toBeNull();
    expect(firstMessage({ question: "Is this right? https://example.com/a" })).toBeNull();
    expect(firstMessage({ question: "See https://a.example and www.b.example too" })).toBe("too-many-links");
  });
});

describe("countLinks", () => {
  it("counts http, https and www links once each", () => {
    expect(countLinks("http://a.example https://www.b.example www.c.example")).toBe(3);
    expect(countLinks("John 3:16 and Romans 8:28")).toBe(0);
  });
});

describe("buildQuestionEmail", () => {
  it("holds only the timestamp, the topic and the question, under a fixed subject", () => {
    const email = buildQuestionEmail(
      { question: "Who wrote Hebrews?", topic: "scripture" },
      "inbox@hobglobal.online",
      new Date("2026-10-21T09:30:00Z"),
    );
    expect(email.subject).toBe(QUESTION_SUBJECT);
    expect(email.to).toBe("inbox@hobglobal.online");
    expect(email.text).toContain("Received: 2026-10-21 09:30 UTC");
    expect(email.text).toContain("Topic: Scripture");
    expect(email.text).toContain("Who wrote Hebrews?");
  });

  it("says when no topic was given", () => {
    expect(buildQuestionEmail({ question: "Who wrote Hebrews?" }, "x@y.z").text).toContain("Topic: Not given");
  });
});

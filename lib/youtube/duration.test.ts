import { describe, expect, it } from "vitest";
import { durationInWords, formatDuration, parseIsoDuration } from "./duration";

describe("parseIsoDuration", () => {
  it.each([
    ["PT45S", 45],
    ["PT28M14S", 1694],
    ["PT1H2M3S", 3723],
    ["PT2H", 7200],
    ["P1DT1S", 86401],
  ])("reads %s as %i seconds", (input, seconds) => {
    expect(parseIsoDuration(input)).toBe(seconds);
  });

  it.each([["P0D"], ["PT0S"], [""], ["P"], ["PT"], ["28:14"], ["PT1.5M"], [null], [42]])("gives null for %s", (input) => {
    expect(parseIsoDuration(input)).toBeNull();
  });
});

describe("formatDuration and durationInWords", () => {
  it.each([
    [45, "0:45", "45 seconds"],
    [65, "1:05", "1 minute 5 seconds"],
    [1694, "28:14", "28 minutes 14 seconds"],
    [3600, "1:00:00", "1 hour"],
    [3723, "1:02:03", "1 hour 2 minutes 3 seconds"],
  ])("shows %i seconds as %s", (seconds, short, words) => {
    expect(formatDuration(seconds)).toBe(short);
    expect(durationInWords(seconds)).toBe(words);
  });
});

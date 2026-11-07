import { describe, expect, it } from "vitest";
import { analyse, headingText } from "./check-html.mjs";

describe("headingText", () => {
  it("reads a heading as a screen reader does: hidden parts out, inline tags joined", () => {
    const about =
      '<span class="sr-only">Didaskalos (<span lang="grc">διδάσκαλος</span>)</span>' +
      '<span aria-hidden="true" class="block"><span class="letter-rise">D</span><span class="letter-rise">i</span></span>' +
      '<span aria-hidden="true" lang="grc">(διδάσκαλος)</span>';
    expect(headingText(about)).toBe("Didaskalos (διδάσκαλος)");
  });

  it("keeps the spaces between words and across line breaks", () => {
    expect(headingText("Understand the Bible<br/> you&#x27;ve <em>been</em> reading.")).toBe(
      "Understand the Bible you've been reading.",
    );
  });
});

describe("analyse, unavailable state", () => {
  const page = (state: string) =>
    `<title>This teaching is unavailable right now | House of Bread Global</title><main id="main"${state}>` +
    "<h1>This teaching is unavailable right now</h1>" +
    "<p>YouTube, where the teaching videos are kept, isn&#x27;t answering at the moment.</p></main>";

  it("passes with a note when a watch or series page shows the unavailable state", () => {
    const result = analyse(page(' data-state="unavailable"'), { key: "What's in this series?", h1InTitle: true });
    expect(result.failures).toEqual([]);
    expect(result.notes).toContain("shows the unavailable state (YouTube not answering)");
  });

  it("still fails a page without the marker that lacks its key sentence", () => {
    const result = analyse(page(""), { key: "What's in this series?", h1InTitle: true });
    expect(result.failures).toEqual(['key sentence missing: "What\'s in this series?"']);
  });
});

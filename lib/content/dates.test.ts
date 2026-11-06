import { describe, expect, it } from "vitest";
import { formatContentDate, zoneName } from "./dates";

describe("formatContentDate", () => {
  it("writes the day in words", () => {
    expect(formatContentDate("2026-10-17")).toBe("17 October 2026");
  });
});

describe("zoneName", () => {
  it("names the city, not the offset", () => {
    expect(zoneName("Africa/Lagos")).toBe("Lagos time");
    expect(zoneName("Europe/London")).toBe("London time");
    expect(zoneName("America/New_York")).toBe("New York time");
    expect(zoneName("America/Argentina/Buenos_Aires")).toBe("Buenos Aires time");
  });

  it("falls back to the short name for a zone with no city", () => {
    expect(zoneName("UTC")).toBe("UTC");
    expect(zoneName("Etc/GMT+1")).toBe("GMT-1");
  });

  it("returns an unknown id as given", () => {
    expect(zoneName("Not/A_Zone")).toBe("Not/A_Zone");
  });
});

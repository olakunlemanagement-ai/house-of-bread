import { describe, expect, it } from "vitest";
import { teachingsLayout } from "./home-teachings-layout";

describe("Home teaching block layout", () => {
  it("shows the lead alone full width when the feed gives nothing more (0 or 1 video)", () => {
    const layout = teachingsLayout(0);
    expect(layout.lead).toBe("");
    expect(layout.grid).not.toMatch(/grid-cols/);
  });

  it("sets two videos side by side as equals from sm", () => {
    const layout = teachingsLayout(1);
    expect(layout.grid).toContain("sm:grid-cols-2");
    expect(layout.lead).toBe("");
    expect(layout.list).not.toMatch(/col-span/);
  });

  it("stacks two cards beside the lead from lg, two across from sm", () => {
    const layout = teachingsLayout(2);
    expect(layout.lead).toBe("lg:col-span-8");
    expect(layout.list).toContain("lg:col-span-4");
    expect(layout.list).toContain("sm:grid-cols-2");
    expect(layout.item).not.toMatch(/lg:/);
  });

  it("keeps the full layout for the lead and three, the shape the skeleton draws", () => {
    const layout = teachingsLayout(3);
    expect(layout.lead).toBe("lg:col-span-8");
    expect(layout.list).toContain("sm:grid-cols-3");
    expect(layout.item).toContain("lg:grid-cols-[9rem_1fr]");
  });

  it("treats anything over three as three, and anything under zero as zero", () => {
    expect(teachingsLayout(5)).toEqual(teachingsLayout(3));
    expect(teachingsLayout(-1)).toEqual(teachingsLayout(0));
  });
});

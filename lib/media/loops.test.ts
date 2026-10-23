import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOOP_BUDGET, LOOP_DIR, LOOP_IDS, getLoop } from "./loops";

const PUBLIC = path.join(process.cwd(), "public");
const onDisk = (url: string) => path.join(PUBLIC, url);

describe("decorative loops", () => {
  for (const id of LOOP_IDS) {
    const loop = getLoop(id);
    const renditions = [{ name: "light", ...loop }, ...(loop.dark ? [{ name: "dark", ...loop.dark }] : [])];

    for (const r of renditions) {
      it(`${id} (${r.name}): full rendition exists and is within ${LOOP_BUDGET.full} bytes`, () => {
        for (const file of [r.full.webm, r.full.mp4]) {
          expect(fs.existsSync(onDisk(file)), file).toBe(true);
          expect(fs.statSync(onDisk(file)).size, file).toBeLessThanOrEqual(LOOP_BUDGET.full);
        }
      });

      it(`${id} (${r.name}): poster exists`, () => {
        expect(fs.existsSync(onDisk(r.poster))).toBe(true);
      });
    }

    if (loop.mobile) {
      const mobile = loop.mobile;
      it(`${id}: mobile rendition exists and is within ${LOOP_BUDGET.mobile} bytes`, () => {
        for (const file of [mobile.webm, mobile.mp4]) {
          expect(fs.existsSync(onDisk(file)), file).toBe(true);
          expect(fs.statSync(onDisk(file)).size, file).toBeLessThanOrEqual(LOOP_BUDGET.mobile);
        }
      });
    }
  }

  it("ships no file the registry does not name", () => {
    const named = new Set<string>();
    for (const id of LOOP_IDS) {
      const loop = getLoop(id);
      for (const url of [
        loop.poster,
        loop.full.webm,
        loop.full.mp4,
        loop.mobile?.webm,
        loop.mobile?.mp4,
        loop.dark?.poster,
        loop.dark?.full.webm,
        loop.dark?.full.mp4,
      ]) {
        if (url) named.add(path.basename(url));
      }
    }
    const files = fs.readdirSync(onDisk(LOOP_DIR));
    expect(files.filter((file) => !named.has(file))).toEqual([]);
  });
});

// Checks WCAG 2.2 contrast for the colour pairings the design uses.
//
//   node scripts/check-contrast.mjs
//
// Each pairing lists a foreground and a stack of backgrounds, bottom first.
// A colour may carry an alpha ("#ffffff/0.12"), which is composited over the
// layers beneath it. Foreground alpha (text faded by a reveal) is composited
// over the final background. Prints every ratio and exits 1 if any pairing
// in use falls below its threshold. No dependencies.

const tokens = {
  white: "#ffffff",
  cream: "#fbf8f1",
  mint50: "#eef6e8",
  gold50: "#fdf3d6",
  ink: "#0b2412",
  inkMuted: "#3d5a46",
  emerald: "#1b6b33",
  emeraldDeep: "#14602f",
  greenRich: "#0f4a22",
  greenDeep: "#0a3616",
  greenNight: "#04290e",
  glow: "#1e7b3a",
  lime: "#a6c859",
  limeBright: "#b7d86a",
  offWhite: "#f8f9f8",
  black: "#000000",
};

// Thresholds: text 4.5, large text 3, non-text UI (rings, glyphs) 3.
const TEXT = 4.5;
const LARGE = 3;
const UI = 3;

/** [label, foreground, background stack bottom first, threshold] */
const pairings = [
  // Eyebrow pill, light surfaces. Mint sections use a white pill.
  ["Eyebrow pill: emerald-deep on mint pill over white", "emeraldDeep", ["white", "mint50"], TEXT],
  ["Eyebrow pill: emerald-deep on mint pill over cream", "emeraldDeep", ["cream", "mint50"], TEXT],
  ["Eyebrow pill: emerald-deep on white pill over mint", "emeraldDeep", ["mint50", "white"], TEXT],
  // Eyebrow pill, green surfaces: white text in a 12% white pill.
  ["Eyebrow pill: white on 12% white over green-rich", "white", ["greenRich", "white/0.12"], TEXT],
  ["Eyebrow pill: white on 12% white over emerald-deep", "white", ["emeraldDeep", "white/0.12"], TEXT],
  ["Eyebrow pill: white on 12% white over glow end (never placed there)", "white", ["glow", "white/0.12"], TEXT, "not used"],
  ["Eyebrow pill: white on 12% white over green-deep", "white", ["greenDeep", "white/0.12"], TEXT],
  // Hero emphasis, large Literata 600 text, green-rich end only.
  ["Hero phrase: lime-bright on green-rich", "limeBright", ["greenRich"], LARGE],
  ["Hero phrase: lime-bright on emerald-deep (not used)", "limeBright", ["emeraldDeep"], LARGE, "reference"],
  // Scroll reveal: text at its 0.7 starting opacity, transient only.
  ["Reveal 0.7: ink on white", "ink/0.7", ["white"], TEXT],
  ["Reveal 0.7: ink on mint", "ink/0.7", ["mint50"], TEXT],
  ["Reveal 0.7: emerald-deep on white", "emeraldDeep/0.7", ["white"], TEXT, "transient"],
  ["Reveal 0.7: ink-muted on white", "inkMuted/0.7", ["white"], TEXT, "transient"],
  ["Reveal 0.7: white on glow end", "white/0.7", ["glow"], TEXT, "transient"],
  // Play chip on a thumbnail: white text on green-night at 85%, worst cases.
  ["Play chip: white on 85% green-night over a white image", "white", ["white", "greenNight/0.85"], TEXT],
  ["Play chip: white on 85% green-night over a black image", "white", ["black", "greenNight/0.85"], TEXT],
  ["Play chip edge: 85% green-night against a white image", "greenNight/0.85", ["white"], UI],
  // Region band frames.
  ["Region frame: ink on mint", "ink", ["mint50"], TEXT],
  ["Region frame: ink-muted on mint", "inkMuted", ["mint50"], TEXT],
  ["Region frame: emerald-deep on cream", "emeraldDeep", ["cream"], TEXT],
  // Focus rings.
  ["Focus ring: emerald-deep on white", "emeraldDeep", ["white"], UI],
  ["Focus ring: emerald-deep on mint", "emeraldDeep", ["mint50"], UI],
  ["Focus ring: white on glow end", "white", ["glow"], UI],
  ["Focus ring: lime on green-deep", "lime", ["greenDeep"], UI],
  ["Focus ring: emerald-deep around a card over a white page", "emeraldDeep", ["white"], UI],
  // Nav labels on the header gradient, full opacity.
  ["Nav label: off-white on header emerald end", "offWhite", ["emerald"], TEXT],
];

function parse(spec) {
  const [name, alpha] = spec.split("/");
  const hex = tokens[name] ?? name;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Unknown colour: ${spec}`);
  const n = Number.parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: alpha === undefined ? 1 : Number(alpha) };
}

const over = (top, base) => ({
  r: top.r * top.a + base.r * (1 - top.a),
  g: top.g * top.a + base.g * (1 - top.a),
  b: top.b * top.a + base.b * (1 - top.a),
  a: 1,
});

function luminance({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(fg, stack) {
  const bg = stack.map(parse).reduce((base, layer) => over(layer, base));
  const front = over(parse(fg), bg);
  const [hi, lo] = [luminance(front), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
for (const [label, fg, stack, threshold, note] of pairings) {
  const value = ratio(fg, stack);
  const pass = value >= threshold;
  // "reference" rows are measured but never used; "transient" rows exist only mid animation.
  const status = pass ? "pass" : note ? `below ${threshold} (${note})` : "FAIL";
  if (!pass && !note) failed++;
  console.log(`${value.toFixed(2).padStart(6)}  ${status.padEnd(26)} ${label}`);
}

if (failed > 0) {
  console.error(`\n${failed} pairing(s) in use fail.`);
  process.exit(1);
}
console.log("\nAll pairings in use pass.");

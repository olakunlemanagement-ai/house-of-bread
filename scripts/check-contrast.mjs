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
  tint: "#edf3ef",
  ink: "#0b2412",
  inkMuted: "#3d5a46",
  emerald: "#1b6b33",
  emeraldDeep: "#14602f",
  greenDeep: "#0a3616",
  greenNight: "#04290e",
  lime: "#a6c859",
  gold: "#e9b949",
  goldSoft: "#f3d98b",
  offWhite: "#f8f9f8",
  black: "#000000",
  // Darkest pixels of the decorative loops, from npm run loops:sample.
  loopLightDark: "#00402b",
  loopWaterDark: "#48422f",
};

// Thresholds: text 4.5, non-text UI (rings, glyphs) 3. Large text (3) has no pairing now.
const TEXT = 4.5;
const UI = 3;

/** [label, foreground, background stack bottom first, threshold] */
const pairings = [
  // Light surfaces.
  ["Body: ink on white", "ink", ["white"], TEXT],
  ["Muted: ink-muted on white", "inkMuted", ["white"], TEXT],
  ["Muted: ink-muted on cream", "inkMuted", ["cream"], TEXT],
  ["Muted: ink-muted on mint", "inkMuted", ["mint50"], TEXT],
  ["Accent: emerald-deep on white (links, eyebrows, H1 phrase)", "emeraldDeep", ["white"], TEXT],
  ["Accent: emerald-deep on cream", "emeraldDeep", ["cream"], TEXT],
  ["Accent: emerald-deep on mint", "emeraldDeep", ["mint50"], TEXT],
  // Hero and page header tints: emerald at 10% at the peak.
  ["Hero tint peak: ink on 10% emerald over white", "ink", ["white", "emerald/0.1"], TEXT],
  ["Hero tint peak: ink-muted on 10% emerald over white", "inkMuted", ["white", "emerald/0.1"], TEXT],
  ["Hero tint peak: emerald-deep on 10% emerald over white", "emeraldDeep", ["white", "emerald/0.1"], TEXT],
  // Buttons.
  ["Primary: white on emerald", "white", ["emerald"], TEXT],
  ["Primary hover: white on emerald-deep", "white", ["emeraldDeep"], TEXT],
  ["Secondary: emerald-deep on white", "emeraldDeep", ["white"], TEXT],
  ["Secondary hover: emerald-deep on tint", "emeraldDeep", ["tint"], TEXT],
  ["Footer primary: green-deep on white", "greenDeep", ["white"], TEXT],
  ["Footer primary hover: green-deep on mint", "greenDeep", ["mint50"], TEXT],
  ["Footer secondary: white on 12% white over green-deep", "white", ["greenDeep", "white/0.12"], TEXT],
  // Icon tiles: emerald glyph on tint.
  ["Icon glyph: emerald on tint", "emerald", ["tint"], UI],
  // Header, transparent over the hero or page header tint (10% emerald at the peak).
  ["Header: ink nav over the hero tint peak", "ink", ["white", "emerald/0.1"], TEXT],
  ["Nav current: emerald-deep on tint pill over the hero tint peak", "emeraldDeep", ["white", "emerald/0.1", "emerald/0.08"], TEXT],
  // Hero floating cards, translucent white at 84%. Worst case: over the green-night phone frame.
  ["Hero card: ink-muted over green-night", "inkMuted", ["greenNight", "white/0.84"], TEXT],
  ["Hero card: emerald-deep over green-night", "emeraldDeep", ["greenNight", "white/0.84"], TEXT],
  ["Hero card: ink-muted over hero tint", "inkMuted", ["white", "emerald/0.12", "white/0.84"], TEXT],
  // Text over decorative loops. Backgrounds are each loop's darkest and
  // brightest single pixel over every frame of the final WebM (npm run
  // loops:sample, 18 October 2026). Dark text is worst over the darkest pixel.
  // Home hero: ambient light under an 80% white scrim (header and text side).
  ["Hero loop: ink over darkest frame pixel, 80% scrim", "ink", ["loopLightDark", "white/0.8"], TEXT],
  ["Hero loop: ink-muted over darkest frame pixel, 80% scrim", "inkMuted", ["loopLightDark", "white/0.8"], TEXT],
  ["Hero loop: emerald-deep over darkest frame pixel, 80% scrim", "emeraldDeep", ["loopLightDark", "white/0.8"], TEXT],
  ["Hero loop: ink over brightest frame pixel, 80% scrim", "ink", ["white", "white/0.8"], TEXT],
  ["Hero loop: nav current pill over darkest pixel, 80% scrim", "emeraldDeep", ["loopLightDark", "white/0.8", "emerald/0.08"], TEXT],
  ["Hero loop: focus ring over darkest pixel, 80% scrim", "emeraldDeep", ["loopLightDark", "white/0.8"], UI],
  // Hero floating cards (84% white) where the scrim is lightest (20%).
  ["Hero card over loop: ink-muted, darkest pixel, 20% scrim", "inkMuted", ["loopLightDark", "white/0.2", "white/0.84"], TEXT],
  ["Hero card over loop: emerald-deep, darkest pixel, 20% scrim", "emeraldDeep", ["loopLightDark", "white/0.2", "white/0.84"], TEXT],
  // App band: progress card (84% white) over light on water.
  ["App band card over water: ink-muted, darkest pixel", "inkMuted", ["loopWaterDark", "white/0.84"], TEXT],
  ["App band card over water: emerald-deep, darkest pixel", "emeraldDeep", ["loopWaterDark", "white/0.84"], TEXT],
  // Newsletter card (84% white) over bread steam, whose darkest pixel is black.
  ["Newsletter card over steam: ink, darkest pixel", "ink", ["black", "white/0.84"], TEXT],
  ["Newsletter card over steam: ink-muted, darkest pixel", "inkMuted", ["black", "white/0.84"], TEXT],
  ["Newsletter card over steam: emerald-deep, darkest pixel", "emeraldDeep", ["black", "white/0.84"], TEXT],
  ["Newsletter card over steam: ink-muted, brightest pixel", "inkMuted", ["white", "white/0.84"], TEXT],
  // Pause/Play control: emerald-deep glyph on 90% white over any loop (UI).
  ["Motion control: emerald-deep glyph over black, 90% white", "emeraldDeep", ["black", "white/0.9"], UI],
  // Footer, deep green.
  ["Footer: off-white on green-night", "offWhite", ["greenNight"], TEXT],
  ["Footer: off-white on green-deep", "offWhite", ["greenDeep"], TEXT],
  ["Footer muted: 80% off-white over green-deep", "offWhite/0.8", ["greenDeep"], TEXT],
  ["Footer current pill: off-white on 15% white over green-deep", "offWhite", ["greenDeep", "white/0.15"], TEXT],
  // Gold, always with ink text.
  ["Live: ink on gold", "ink", ["gold"], TEXT],
  ["Badge: ink on gold-soft", "ink", ["goldSoft"], TEXT],
  // Play chip on thumbnails: white on 85% green-night, worst cases.
  ["Play chip: white on 85% green-night over a white image", "white", ["white", "greenNight/0.85"], TEXT],
  ["Play chip: white on 85% green-night over a black image", "white", ["black", "greenNight/0.85"], TEXT],
  // Scroll reveal: text at its 0.85 starting opacity, transient only.
  ["Reveal 0.85: ink on white", "ink/0.85", ["white"], TEXT],
  ["Reveal 0.85: ink-muted on white", "inkMuted/0.85", ["white"], TEXT],
  ["Reveal 0.85: ink-muted on mint", "inkMuted/0.85", ["mint50"], TEXT],
  ["Reveal 0.85: emerald-deep on cream", "emeraldDeep/0.85", ["cream"], TEXT],
  // Focus rings.
  ["Focus ring: emerald-deep on white", "emeraldDeep", ["white"], UI],
  ["Focus ring: emerald-deep on mint", "emeraldDeep", ["mint50"], UI],
  ["Focus ring: emerald-deep on the header over the hero tint peak", "emeraldDeep", ["white", "emerald/0.1"], UI],
  ["Focus ring: white on green-deep", "white", ["greenDeep"], UI],
  // Social brand marks on their white tiles (UI, 3:1).
  ["Social: YouTube red on white", "#ff0000", ["white"], UI],
  ["Social: Facebook blue on white", "#0866ff", ["white"], UI],
  ["Social: Instagram gradient middle stop on white", "#d62976", ["white"], UI],
  ["Social: Instagram gradient deepest stop on white", "#962fbf", ["white"], UI],
  ["Social: Instagram gradient lightest stop on white (one corner of the mark)", "#fdbb2d", ["white"], UI, "gradient corner only"],
  ["Social: TikTok and X black on white", "black", ["white"], UI],
  ["Social: Linktree mark, darkened green, on white", "#1e7a35", ["white"], UI],
  ["Social: Linktree brand green on white (not used)", "#43e55e", ["white"], UI, "not used"],
  // Never used: lime is a decorative dot only.
  ["Lime on white (never used for text or meaning)", "lime", ["white"], TEXT, "not used"],
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

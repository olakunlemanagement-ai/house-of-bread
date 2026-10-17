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
  // Header, white at 96%. Worst case: a black thumbnail scrolled under it.
  ["Header: ink over black", "ink", ["black", "white/0.96"], TEXT],
  ["Header: emerald-deep over black", "emeraldDeep", ["black", "white/0.96"], TEXT],
  ["Header: ink over a green-night phone frame", "ink", ["greenNight", "white/0.96"], TEXT],
  ["Nav current: emerald-deep on tint pill over the header over black", "emeraldDeep", ["black", "white/0.96", "emerald/0.08"], TEXT],
  // Hero floating cards, translucent white at 84%. Worst case: over the green-night phone frame.
  ["Hero card: ink-muted over green-night", "inkMuted", ["greenNight", "white/0.84"], TEXT],
  ["Hero card: emerald-deep over green-night", "emeraldDeep", ["greenNight", "white/0.84"], TEXT],
  ["Hero card: ink-muted over hero tint", "inkMuted", ["white", "emerald/0.12", "white/0.84"], TEXT],
  // Newsletter card, translucent white at 84% over the gold and mint tints.
  ["Newsletter card: ink-muted over gold-50", "inkMuted", ["gold50", "white/0.84"], TEXT],
  ["Newsletter card: ink-muted over mint-50", "inkMuted", ["mint50", "white/0.84"], TEXT],
  ["Newsletter card: emerald-deep over gold-50", "emeraldDeep", ["gold50", "white/0.84"], TEXT],
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
  ["Focus ring: emerald-deep on the header over black", "emeraldDeep", ["black", "white/0.96"], UI],
  ["Focus ring: white on green-deep", "white", ["greenDeep"], UI],
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

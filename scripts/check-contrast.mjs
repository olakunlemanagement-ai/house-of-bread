// Checks WCAG 2.2 contrast for the colour pairings the design uses, in both
// themes.
//
//   node scripts/check-contrast.mjs
//
// Each pairing lists a foreground and a stack of backgrounds, bottom first.
// A colour may carry an alpha ("#ffffff/0.12"), which is composited over the
// layers beneath it. Foreground alpha (text faded by a reveal) is composited
// over the final background.
//
// Role pairings are written once with @role names (such as "@muted" on
// "@surface") and run in the light and the dark theme, each with its own role
// table below. Pairings that exist in one theme only (the light loops, the
// dark glows) sit in that theme's own list. Theme invariant pairings (the
// deep green footer, gold fills, brand marks on white tiles) run once.
// Prints every ratio and exits 1 if any pairing in use falls below its
// threshold. No dependencies. Values mirror app/globals.css.

const tokens = {
  // Light palette.
  white: "#ffffff",
  cream: "#fbf8f1",
  mint50: "#eef6e8",
  gold50: "#fdf3d6",
  tint: "#edf3ef",
  ink: "#0b2412",
  inkMuted: "#3d5a46",
  emerald: "#1b6b33",
  emeraldDeep: "#14602f",
  leaf: "#2e9e4f",
  greenDeep: "#0a3616",
  greenNight: "#04290e",
  lime: "#a6c859",
  gold: "#e9b949",
  goldSoft: "#f3d98b",
  offWhite: "#f8f9f8",
  black: "#000000",
  // Night palette (dark theme).
  night: "#0a1510",
  nightRaised: "#111e17",
  nightMint: "#10211a",
  nightWarm: "#16170f",
  nightGold: "#1c1a10",
  nightTint: "#163122",
  mist: "#e9f0ea",
  mistMuted: "#a8bcae",
  spring: "#8fd3a5",
  sprout: "#6dbf88",
  emeraldNight: "#1e7438",
  // Darkest pixels of the decorative loops, from npm run loops:sample.
  loopLightDark: "#00402b",
  loopWaterDark: "#48422f",
  // Brightest pixels of the dark loops that sit behind text or glass
  // (npm run loops:sample, 23 October 2026).
  loopAmbientDarkBright: "#aece9b",
  // Logo lid edge, the mark's lightest green edge.
  logoLid: "#397733",
};

// Thresholds: text 4.5, non-text UI (rings, glyphs) 3.
const TEXT = 4.5;
const UI = 3;

/** Role names per theme. A role may be a stack fragment ("a, b/0.1"). */
const roles = {
  light: {
    surface: "white",
    raised: "white",
    warm: "cream",
    mint: "mint50",
    tint: "tint",
    ink: "ink",
    muted: "inkMuted",
    accent: "emeraldDeep",
    eyebrow: "emeraldDeep",
    glyph: "emerald",
    ring: "emeraldDeep",
    fill: "emerald",
    fillHover: "emeraldDeep",
    // Hero and page header tints at their peak: 10% emerald.
    heroPeak: "white, emerald/0.1",
    // Translucent cards, and the worst background each one meets.
    glass: "white/0.84",
    glassWorst: "greenNight",
  },
  dark: {
    surface: "night",
    raised: "nightRaised",
    warm: "nightWarm",
    mint: "nightMint",
    tint: "nightTint",
    ink: "mist",
    muted: "mistMuted",
    accent: "spring",
    eyebrow: "lime",
    glyph: "sprout",
    ring: "spring",
    fill: "emeraldNight",
    fillHover: "emerald",
    // Hero tint peak: 16% leaf over night.
    heroPeak: "night, leaf/0.16",
    // Dark glass over white: the lightest thing that can sit behind it.
    glass: "nightRaised/0.88",
    glassWorst: "white",
  },
};

/** [label, foreground, background stack bottom first, threshold, note?] */
const shared = [
  ["Body: ink on surface", "@ink", ["@surface"], TEXT],
  ["Body: ink on raised", "@ink", ["@raised"], TEXT],
  ["Body: ink on warm band", "@ink", ["@warm"], TEXT],
  ["Body: ink on mint band", "@ink", ["@mint"], TEXT],
  ["Muted on surface", "@muted", ["@surface"], TEXT],
  ["Muted on raised", "@muted", ["@raised"], TEXT],
  ["Muted on warm band", "@muted", ["@warm"], TEXT],
  ["Muted on mint band", "@muted", ["@mint"], TEXT],
  ["Accent (links, H1 phrase, TextCTA) on surface", "@accent", ["@surface"], TEXT],
  ["Accent on raised", "@accent", ["@raised"], TEXT],
  ["Accent on warm band", "@accent", ["@warm"], TEXT],
  ["Accent on mint band", "@accent", ["@mint"], TEXT],
  ["Eyebrow on surface", "@eyebrow", ["@surface"], TEXT],
  ["Eyebrow on raised", "@eyebrow", ["@raised"], TEXT],
  ["Eyebrow on mint band", "@eyebrow", ["@mint"], TEXT],
  ["Eyebrow on warm band", "@eyebrow", ["@warm"], TEXT],
  ["Hero tint peak: ink", "@ink", ["@heroPeak"], TEXT],
  ["Hero tint peak: muted", "@muted", ["@heroPeak"], TEXT],
  ["Hero tint peak: accent", "@accent", ["@heroPeak"], TEXT],
  ["Hero tint peak: eyebrow", "@eyebrow", ["@heroPeak"], TEXT],
  // Buttons.
  ["Primary: white on fill", "white", ["@fill"], TEXT],
  ["Primary hover: white on fill hover", "white", ["@fillHover"], TEXT],
  ["Secondary: accent on raised", "@accent", ["@raised"], TEXT],
  ["Secondary hover: accent on tint", "@accent", ["@tint"], TEXT],
  // Icon tiles, rules and the card glow ring.
  ["Icon glyph on tint", "@glyph", ["@tint"], UI],
  ["Glyph (clock, rules) on surface", "@glyph", ["@surface"], UI],
  ["Card glow ring on surface", "@glyph", ["@surface"], UI],
  ["Card glow ring on mint", "@glyph", ["@mint"], UI],
  ["Card glow ring on warm", "@glyph", ["@warm"], UI],
  // Header, transparent over the hero tint.
  ["Header: ink nav over the hero tint peak", "@ink", ["@heroPeak"], TEXT],
  // Theme switch, styled like the Menu button: accent glyph on raised, tint on hover.
  ["Header theme switch: accent glyph on raised", "@accent", ["@raised"], UI],
  ["Header theme switch hover: accent glyph on tint", "@accent", ["@tint"], UI],
  ["Header theme switch and Menu: glyph border at 55% over the hero tint peak", "@glyph/0.55", ["@heroPeak"], UI, "glyph identifies the control"],
  ["Nav current and theme choice: accent on tint pill over the hero tint peak", "@accent", ["@heroPeak", "@tint/0.9"], TEXT],
  ["Theme choice current: accent on tint over surface (menu)", "@accent", ["@surface", "@tint"], TEXT],
  // Translucent cards (hero floating cards, newsletter card).
  ["Glass card: ink over its worst background", "@ink", ["@glassWorst", "@glass"], TEXT],
  ["Glass card: muted over its worst background", "@muted", ["@glassWorst", "@glass"], TEXT],
  ["Glass card: accent over its worst background", "@accent", ["@glassWorst", "@glass"], TEXT],
  ["Glass card: eyebrow over its worst background", "@eyebrow", ["@glassWorst", "@glass"], TEXT],
  ["Glass card: muted over the hero tint", "@muted", ["@heroPeak", "@glass"], TEXT],
  // Scripture panel: mint with a glyph rule and an emerald version pill.
  ["Scripture: ink on mint", "@ink", ["@mint"], TEXT],
  ["Scripture: reference, accent on mint", "@accent", ["@mint"], TEXT],
  ["Scripture: rule, glyph on mint", "@glyph", ["@mint"], UI],
  ["Scripture: version pill, white on fill", "white", ["@fill"], TEXT],
  // Forms.
  ["Input text: ink on raised", "@ink", ["@raised"], TEXT],
  ["Input border: muted on raised", "@muted", ["@raised"], UI],
  ["Input border: muted on surface", "@muted", ["@surface"], UI],
  // Image slot caption pill.
  ["Image slot caption: ink on raised pill", "@ink", ["@raised"], TEXT],
  // Session times.
  ["Session times: ink on surface", "@ink", ["@surface"], TEXT],
  ["Session times: Your time, accent on surface", "@accent", ["@surface"], TEXT],
  ["Weekly card: ink on mint", "@ink", ["@mint"], TEXT],
  // Academy questions: a native details accordion, raised cards on the mint band.
  ["Academy question: ink on surface", "@ink", ["@surface"], TEXT],
  ["Academy answer: muted on surface", "@muted", ["@surface"], TEXT],
  ["Academy question chevron: glyph on surface", "@glyph", ["@surface"], UI],
  // Scroll reveal: text at its 0.85 starting opacity, transient only.
  ["Reveal 0.85: ink on surface", "@ink/0.85", ["@surface"], TEXT],
  ["Reveal 0.85: muted on surface", "@muted/0.85", ["@surface"], TEXT],
  ["Reveal 0.85: muted on mint", "@muted/0.85", ["@mint"], TEXT],
  ["Reveal 0.85: muted on warm (app tile)", "@muted/0.85", ["@warm"], TEXT],
  ["Reveal 0.85: accent on warm", "@accent/0.85", ["@warm"], TEXT],
  ["Reveal 0.85: accent on mint (live tile)", "@accent/0.85", ["@mint"], TEXT],
  ["Reveal 0.85: white on fill (live tile button)", "white/0.85", ["@fill"], TEXT],
  // Focus rings, 3px.
  ["Focus ring on surface", "@ring", ["@surface"], UI],
  ["Focus ring on raised", "@ring", ["@raised"], UI],
  ["Focus ring on mint", "@ring", ["@mint"], UI],
  ["Focus ring on warm", "@ring", ["@warm"], UI],
  ["Focus ring over the hero tint peak", "@ring", ["@heroPeak"], UI],
  ["Focus ring on tint (current pill)", "@ring", ["@tint"], UI],
];

/** Light only. Labels keep their earlier wording, so the log stays comparable. */
const lightOnly = [
  // Hero floating cards over the green-night phone frame (light glass).
  ["Hero card: emerald-deep over green-night", "emeraldDeep", ["greenNight", "white/0.84"], TEXT],
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
  // Logo mark, no tile on light.
  ["Logo lid edge on white (header, plain pages)", "logoLid", ["white"], UI],
  ["Logo lid edge over the hero tint peak", "logoLid", ["white", "emerald/0.1"], UI],
  // Never used: lime is a decorative dot only on light.
  ["Lime on white (never used for text or meaning)", "lime", ["white"], TEXT, "not used"],
];

/**
 * Dark only. Loops with a dark rendition play it; the rest are replaced by
 * still glows. The logo mark sits in a white tile.
 */
const darkOnly = [
  // Home hero: the dark ambient loop (light through smoke) under an 80%
  // night scrim. Light text is worst over the loop's brightest pixel.
  ["Dark hero loop: ink over brightest frame pixel, 80% night scrim", "mist", ["loopAmbientDarkBright", "night/0.8"], TEXT],
  ["Dark hero loop: muted over brightest frame pixel, 80% night scrim", "mistMuted", ["loopAmbientDarkBright", "night/0.8"], TEXT],
  ["Dark hero loop: accent (H1 phrase, TextCTA), brightest pixel, 80% night scrim", "spring", ["loopAmbientDarkBright", "night/0.8"], TEXT],
  ["Dark hero loop: lime eyebrow, brightest pixel, 80% night scrim", "lime", ["loopAmbientDarkBright", "night/0.8"], TEXT],
  ["Dark hero loop: nav current pill, brightest pixel, 80% night scrim", "spring", ["loopAmbientDarkBright", "night/0.8", "nightTint"], TEXT],
  ["Dark hero loop: focus ring, brightest pixel, 80% night scrim", "spring", ["loopAmbientDarkBright", "night/0.8"], UI],
  // Hero floating cards (dark glass) where the scrim is lightest (20%).
  ["Dark hero card over the loop: muted, brightest pixel, 20% night scrim", "mistMuted", ["loopAmbientDarkBright", "night/0.2", "nightRaised/0.88"], TEXT],
  ["Dark hero card over the loop: accent, brightest pixel, 20% night scrim", "spring", ["loopAmbientDarkBright", "night/0.2", "nightRaised/0.88"], TEXT],
  // App band: the progress card (dark glass) over the dark water loop, whose brightest pixel is white.
  ["App band glass over dark water: muted, brightest pixel", "mistMuted", ["white", "nightRaised/0.88"], TEXT],
  ["App band glass over dark water: accent, brightest pixel", "spring", ["white", "nightRaised/0.88"], TEXT],
  // Home hero swirl at its brightest overlap: the leaf ribbon, the lime breath and the emerald glow.
  ["Hero swirl peak: ink", "mist", ["night", "leaf/0.22", "lime/0.06", "emerald/0.28"], TEXT],
  ["Hero swirl peak: muted", "mistMuted", ["night", "leaf/0.22", "lime/0.06", "emerald/0.28"], TEXT],
  ["Hero swirl peak: accent (H1 phrase, TextCTA)", "spring", ["night", "leaf/0.22", "lime/0.06", "emerald/0.28"], TEXT],
  ["Hero swirl peak: lime eyebrow", "lime", ["night", "leaf/0.22", "lime/0.06", "emerald/0.28"], TEXT],
  ["Hero swirl peak: focus ring", "spring", ["night", "leaf/0.22", "lime/0.06", "emerald/0.28"], UI],
  ["Hero card over the swirl peak: muted", "mistMuted", ["night", "leaf/0.22", "lime/0.06", "emerald/0.28", "nightRaised/0.88"], TEXT],
  // Newsletter frame: warm gold and green glows over raised night.
  ["Newsletter frame glow: muted on glass over the gold glow", "mistMuted", ["nightRaised", "gold/0.1", "nightRaised/0.88"], TEXT],
  // App band: the progress card (glass) over the water glow at its brightest.
  ["App band glass over the water glow: muted", "mistMuted", ["nightRaised", "spring/0.14", "leaf/0.22", "nightRaised/0.88"], TEXT],
  ["App band glass over the water glow: accent", "spring", ["nightRaised", "spring/0.14", "leaf/0.22", "nightRaised/0.88"], TEXT],
  // Logo mark in its white tile, and the tile itself on night.
  ["Logo tile: white tile on night", "white", ["night"], UI],
  ["Logo lid edge on the white tile", "logoLid", ["white"], UI],
  // Lime is eyebrow text in dark only.
  ["Lime eyebrow on tint (icon well context)", "lime", ["nightTint"], TEXT],
  // Disabled primary (Subscribe while signup is closed): exempt, recorded only.
  ["Disabled primary: white on ink-muted (exempt)", "white", ["inkMuted"], TEXT, "disabled, exempt"],
];

/** Theme invariant: the deep green footer, gold fills, brand marks and play chips. */
const invariant = [
  ["Footer: off-white on green-night", "offWhite", ["greenNight"], TEXT],
  ["Footer: off-white on green-deep", "offWhite", ["greenDeep"], TEXT],
  ["Footer muted: 80% off-white over green-deep", "offWhite/0.8", ["greenDeep"], TEXT],
  ["Footer current pill and theme choice: off-white on 15% white over green-deep", "offWhite", ["greenDeep", "white/0.15"], TEXT],
  ["Footer primary: green-deep on white", "greenDeep", ["white"], TEXT],
  ["Footer primary hover: green-deep on mint", "greenDeep", ["mint50"], TEXT],
  ["Footer secondary: white on 12% white over green-deep", "white", ["greenDeep", "white/0.12"], TEXT],
  ["Footer focus ring: white on green-deep", "white", ["greenDeep"], UI],
  ["Footer logo tile: white tile on green-deep", "white", ["greenDeep"], UI],
  ["Logo lid edge on green-deep without a tile (not used, why the tile stays)", "logoLid", ["greenDeep"], UI, "not used"],
  ["Live: ink on gold", "ink", ["gold"], TEXT],
  ["Badge: ink on gold-soft", "ink", ["goldSoft"], TEXT],
  ["Play chip: white on 85% green-night over a white image", "white", ["white", "greenNight/0.85"], TEXT],
  ["Play chip: white on 85% green-night over a black image", "white", ["black", "greenNight/0.85"], TEXT],
  // Social brand marks on their white tiles (UI, 3:1), white in both themes.
  ["Social: YouTube red on white", "#ff0000", ["white"], UI],
  ["Social: Facebook blue on white", "#0866ff", ["white"], UI],
  ["Social: Instagram gradient middle stop on white", "#d62976", ["white"], UI],
  ["Social: Instagram gradient deepest stop on white", "#962fbf", ["white"], UI],
  ["Social: Instagram gradient lightest stop on white (one corner of the mark)", "#fdbb2d", ["white"], UI, "gradient corner only"],
  ["Social: TikTok and X black on white", "black", ["white"], UI],
  ["Social: Linktree mark, darkened green, on white", "#1e7a35", ["white"], UI],
  ["Social: Linktree brand green on white (not used)", "#43e55e", ["white"], UI, "not used"],
];

/** Replace @role names with the theme's value. A role may expand to several layers. */
function resolveSpec(spec, theme) {
  if (!spec.startsWith("@")) return [spec];
  const [name, alpha] = spec.slice(1).split("/");
  const value = roles[theme][name];
  if (value === undefined) throw new Error(`Unknown role: ${spec}`);
  const layers = value.split(",").map((s) => s.trim());
  if (alpha === undefined) return layers;
  if (layers.length !== 1) throw new Error(`Alpha on a stacked role: ${spec}`);
  return [`${layers[0].split("/")[0]}/${alpha}`];
}

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
function run(title, rows, theme) {
  console.log(`\n${title}`);
  for (const [label, fg, stack, threshold, note] of rows) {
    const front = theme ? resolveSpec(fg, theme) : [fg];
    const layers = theme ? stack.flatMap((s) => resolveSpec(s, theme)) : stack;
    const value = ratio(front[0], layers);
    const pass = value >= threshold;
    // Rows with a note are measured but not in use, transient or exempt.
    const status = pass ? "pass" : note ? `below ${threshold} (${note})` : "FAIL";
    if (!pass && !note) failed++;
    console.log(`${value.toFixed(2).padStart(6)}  ${status.padEnd(26)} ${label}`);
  }
}

run("Light theme, shared roles", shared, "light");
run("Light theme only", lightOnly);
run("Dark theme, shared roles", shared, "dark");
run("Dark theme only", darkOnly);
run("Both themes (theme invariant)", invariant);

if (failed > 0) {
  console.error(`\n${failed} pairing(s) in use fail.`);
  process.exit(1);
}
console.log("\nAll pairings in use pass, in both themes.");

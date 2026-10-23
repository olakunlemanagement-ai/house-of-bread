// The theme and the Motion setting, set before first paint. Framework free,
// so the CSP test, the layout and the tests share one copy.

/** localStorage key for the visitor's choice: "light" or "dark". Absent means system. */
export const THEME_KEY = "hob:theme";

/** localStorage key for the Motion setting: "on" or "off". Absent means follow prefers-reduced-motion. */
export const MOTION_KEY = "hob:motion";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Browser chrome colour per theme: white, and the night surface (--brand-night). */
export const THEME_COLOR = { light: "#ffffff", dark: "#0a1510" } as const;

/**
 * Runs inline in <head>, before the stylesheet paints anything. It marks
 * the page as scripted (data-js, which reveals the theme and Motion
 * controls) and applies a saved light or dark choice as data-theme. With no
 * saved choice it leaves data-theme off, so the CSS media query follows the
 * system. It always sets data-motion to "on" or "off": the saved choice, or
 * else "off" under prefers-reduced-motion. Off hides every loop video by CSS
 * from the first paint. Storage can throw (blocked site data), hence the try.
 * The CSP allows it through 'unsafe-inline' (lib/security/headers.ts). If the
 * policy moves to hashes, add the sha256 of this exact string.
 */
export const themeScript = `(function(){var d=document.documentElement,t,m;d.setAttribute("data-js","");try{t=localStorage.getItem("${THEME_KEY}");m=localStorage.getItem("${MOTION_KEY}")}catch(e){}if(t==="light"||t==="dark")d.setAttribute("data-theme",t);if(m!=="on"&&m!=="off")m=window.matchMedia&&matchMedia("${REDUCED_MOTION_QUERY}").matches?"off":"on";d.setAttribute("data-motion",m)})()`;

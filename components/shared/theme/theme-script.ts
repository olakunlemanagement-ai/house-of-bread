// The theme, set before first paint. Framework free, so the CSP test and the
// layout share one copy.

/** localStorage key for the visitor's choice: "light" or "dark". Absent means system. */
export const THEME_KEY = "hob:theme";

/** Browser chrome colour per theme: white, and the night surface (--brand-night). */
export const THEME_COLOR = { light: "#ffffff", dark: "#0a1510" } as const;

/**
 * Runs inline in <head>, before the stylesheet paints anything. It marks
 * the page as scripted (data-js, which reveals the theme controls) and
 * applies a saved light or dark choice as data-theme. With no saved choice
 * it leaves data-theme off, so the CSS media query follows the system.
 * Storage can throw (blocked site data), hence the try.
 * The CSP allows it through 'unsafe-inline' (lib/security/headers.ts). If the
 * policy moves to hashes, add the sha256 of this exact string.
 */
export const themeScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}})()`;

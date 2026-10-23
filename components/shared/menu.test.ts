import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MENU_SELECTOR, closeMenus, closeMenusOnNavigation } from "./menu";

// CLAUDE.md section 7, Navigation: the mobile menu is a details element that
// works without JavaScript. A tap on Menu at any point in load must open it,
// and hydration must never close it again.

/** A stub page with one mobile menu, open or closed. */
function page(open: boolean) {
  const attrs = new Set(open ? ["open"] : []);
  const menu = { removeAttribute: (name: string) => attrs.delete(name) };
  const root = {
    querySelectorAll: (selector: string) => (selector === MENU_SELECTOR ? [menu] : []),
  };
  return { root, isOpen: () => attrs.has("open"), tap: () => attrs.add("open") };
}

describe("mobile menu and hydration", () => {
  it("keeps a menu opened before hydration open through the mount effect", () => {
    const { root, isOpen } = page(true);
    const lastPath = { current: "/" }; // useRef(pathname) at hydration
    // Strict Mode runs the mount effect twice.
    expect(closeMenusOnNavigation(lastPath, "/", root)).toBe(false);
    expect(closeMenusOnNavigation(lastPath, "/", root)).toBe(false);
    expect(isOpen()).toBe(true);
  });

  it("keeps the menu open while the path is still unresolved", () => {
    const { root, isOpen } = page(true);
    const lastPath = { current: null };
    expect(closeMenusOnNavigation(lastPath, null, root)).toBe(false);
    expect(isOpen()).toBe(true);
  });

  it("closes the menu after a client side navigation", () => {
    const { root, isOpen } = page(true);
    const lastPath = { current: "/" };
    closeMenusOnNavigation(lastPath, "/", root);
    expect(closeMenusOnNavigation(lastPath, "/academy", root)).toBe(true);
    expect(isOpen()).toBe(false);
    expect(lastPath.current).toBe("/academy");
  });

  it("lets the menu open again after a navigation, until the next one", () => {
    const { root, isOpen, tap } = page(true);
    const lastPath = { current: "/" };
    closeMenusOnNavigation(lastPath, "/academy", root);
    tap();
    // The effect reruns for the same path: the reopened menu stays open.
    expect(closeMenusOnNavigation(lastPath, "/academy", root)).toBe(false);
    expect(isOpen()).toBe(true);
    closeMenusOnNavigation(lastPath, "/media", root);
    expect(isOpen()).toBe(false);
  });

  it("closeMenus closes every mobile menu", () => {
    const a = page(true);
    const b = page(true);
    closeMenus({ querySelectorAll: (s) => [...Array.from(a.root.querySelectorAll(s)), ...Array.from(b.root.querySelectorAll(s))] });
    expect(a.isOpen()).toBe(false);
    expect(b.isOpen()).toBe(false);
  });
});

describe("mobile menu without JavaScript", () => {
  const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
  const header = read("components/shared/SiteHeader.tsx");
  const navLinks = read("components/shared/NavLinks.tsx");
  const css = read("app/globals.css");

  it("is a native details and summary rendered on the server", () => {
    expect(header).not.toMatch(/^["']use client["']/m);
    expect(header).toMatch(/<details\s+data-menu/);
    expect(header).toMatch(/<summary[\s>]/);
  });

  it("leaves the open state to the browser, never a React prop", () => {
    const details = header.slice(header.indexOf("<details"), header.indexOf(">", header.indexOf("<details")));
    expect(details).not.toMatch(/\bopen\b/);
    expect(details).not.toMatch(/onToggle|onClick/);
  });

  it("closes the menu only through the navigation guard", () => {
    expect(navLinks).toContain("closeMenusOnNavigation(");
    expect(navLinks).not.toMatch(/querySelectorAll\(\s*["']details/);
  });

  it("never hides the menu or its links until scripts run", () => {
    const noJsRules = css.match(/html:not\(\[data-js\]\)[^{]*\{/g) ?? [];
    for (const rule of noJsRules) {
      expect(rule).not.toMatch(/data-menu|menu-panel|summary/);
    }
  });
});

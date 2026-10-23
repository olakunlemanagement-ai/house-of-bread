/**
 * The mobile menu is a details element marked data-menu, so it opens and
 * closes without JavaScript. Scripts only ever close it, and only after a
 * client side navigation.
 */
export const MENU_SELECTOR = "details[data-menu]";

type MenuRoot = { querySelectorAll(selector: string): ArrayLike<{ removeAttribute(name: string): void }> };

/** Closes every mobile menu under the root. */
export function closeMenus(root: MenuRoot) {
  Array.from(root.querySelectorAll(MENU_SELECTOR)).forEach((menu) => menu.removeAttribute("open"));
}

/**
 * Closes the menus only when the path differs from the one last seen. The
 * ref starts at the path rendered at hydration, so the mount effect (run
 * twice in Strict Mode) is a no-op and a menu tapped open before hydration
 * stays open.
 */
export function closeMenusOnNavigation(
  lastPath: { current: string | null },
  pathname: string | null,
  root: MenuRoot,
) {
  if (lastPath.current === pathname) return false;
  lastPath.current = pathname;
  closeMenus(root);
  return true;
}

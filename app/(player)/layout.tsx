import { SiteFooter } from "@/components/shared/SiteFooter";

/**
 * The focused lesson player (BibleProject's session player): no site
 * header or announcement bar, only the lesson bar each page draws, so the
 * lesson has the screen. The footer stays, with the site's one theme
 * choice and Motion control.
 */
export default function PlayerLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}

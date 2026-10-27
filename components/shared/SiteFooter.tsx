import { Suspense } from "react";
import { footerNav } from "./nav-links";
import { NavLinks, StaticNavLinks } from "./NavLinks";
import { Logo } from "./Logo";
import { Placeholder } from "./Placeholder";
import { SocialLinks } from "./SocialLinks";
import { StoreButtons } from "./StoreButtons";
import { MotionToggle } from "./theme/MotionToggle";
import { ThemeChoice } from "./theme/ThemeChoice";

const columnHeading = "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-green-muted";

/**
 * The dark footer, deep green in both themes, and the trust block of every
 * page: the full ministry name, one list of links (what we believe,
 * contact, privacy among them), socials, the app badges once the store
 * links exist, and the site's only theme and Motion controls. White text
 * and links, white focus ring.
 */
export function SiteFooter() {
  return (
    <footer className="tone-deep bg-green-footer relative mt-auto overflow-hidden">
      <div className="container-page relative">
        <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-x-16 lg:py-16">
          <div>
            <p className="text-base text-on-green">
              <Logo onDeep />
            </p>
            {/* The full name is unconfirmed (docs/RESET-BRIEF.md section 6), so it stays in brackets. */}
            <p className="mt-4 text-on-green">
              <Placeholder>[House of Bread Ministries International]</Placeholder>
            </p>
            <div className="mt-5">
              <SocialLinks />
            </div>
            <div className="mt-6">
              <StoreButtons hideMissing tone="green" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <nav aria-label="Footer">
              <Suspense fallback={<StaticNavLinks layout="footer" items={footerNav} />}>
                <NavLinks layout="footer" items={footerNav} />
              </Suspense>
            </nav>
            <div data-theme-control className="flex flex-wrap gap-x-8 gap-y-6">
              <ThemeChoice legendClassName={columnHeading} />
              <MotionToggle labelClassName={columnHeading} />
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 py-6 text-sm text-on-green-muted">
          <p>
            © 2026 <Placeholder>[House of Bread Ministries International]</Placeholder>
          </p>
        </div>
      </div>
    </footer>
  );
}

import { siteConfig } from "@/lib/site-config";
import { Icon } from "./icons";
import { PlaceholderBadge } from "./Placeholder";

const button =
  "inline-flex min-h-13 w-full items-center gap-3 rounded-button px-5 py-2 sm:w-auto";
const pending = `${button} flex-wrap border-2 border-dashed border-fg-link font-mono text-sm text-fg`;

/**
 * Store buttons. No link is invented: each renders as a marked placeholder in
 * the shape of a store button until the app developer supplies it.
 * TODO: replace with real store links, tracked as a Plausible goal.
 */
export function StoreButtons({ confirmLabel = "CONFIRM WITH APP DEVELOPER" }: { confirmLabel?: string }) {
  const { googlePlay, appStore } = siteConfig.links;
  const live = `${button} bg-fg-link font-semibold text-surface hover:opacity-90 [.tone-green_&]:text-ink`;

  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <li>
        {googlePlay ? (
          <a href={googlePlay} className={live}>
            <Icon name="phone" className="size-5" />
            Get it on Google Play
          </a>
        ) : (
          <span data-placeholder className={pending}>
            <PlaceholderBadge />
            [GOOGLE PLAY LINK]
          </span>
        )}
      </li>
      <li>
        {appStore ? (
          <a href={appStore} className={live}>
            <Icon name="phone" className="size-5" />
            Download on the App Store
          </a>
        ) : (
          <span data-placeholder className={pending}>
            <PlaceholderBadge />
            [APP STORE LINK OR &quot;COMING SOON&quot;, {confirmLabel}]
          </span>
        )}
      </li>
    </ul>
  );
}

import { PlaceholderBadge } from "./Placeholder";

const pill =
  "inline-flex min-h-12 flex-wrap items-center gap-2 rounded-full border-2 border-dashed border-fg-link px-5 py-2 font-mono text-sm text-fg";

/**
 * Store links. No link is invented: each renders as a marked placeholder in
 * the shape of a store button until the app developer supplies it.
 * TODO: replace with real store links, tracked as a Plausible goal.
 */
export function StoreButtons({ confirmLabel = "CONFIRM WITH APP DEVELOPER" }: { confirmLabel?: string }) {
  return (
    <ul className="flex flex-wrap gap-3">
      <li data-placeholder className={pill}>
        <PlaceholderBadge />
        [GOOGLE PLAY LINK]
      </li>
      <li data-placeholder className={pill}>
        <PlaceholderBadge />
        [APP STORE LINK OR &quot;COMING SOON&quot;, {confirmLabel}]
      </li>
    </ul>
  );
}

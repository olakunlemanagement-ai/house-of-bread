import { siteConfig, type SocialAccount } from "@/lib/site-config";
import { buttonClasses, type ButtonTone, type ButtonVariant } from "./Button";
import { Icon } from "./icons";
import { PlaceholderBadge } from "./Placeholder";
import { platformName, SocialIcon } from "./SocialIcons";

const tile =
  "inline-flex min-h-12 items-center gap-3 rounded-button border-2 px-5 py-2 font-semibold";
const pending = `${tile} border-dashed border-fg-link font-mono text-sm font-normal text-fg`;

/**
 * A button to the ministry's YouTube channel, or a marked placeholder in the
 * button's shape until the channel link is supplied.
 */
export function YouTubeChannelButton({
  label,
  tone = "light",
  variant = "secondary",
  className = "",
}: {
  label: string;
  tone?: ButtonTone;
  variant?: ButtonVariant;
  className?: string;
}) {
  const { youtubeChannel } = siteConfig.links;
  if (youtubeChannel) {
    return (
      <a href={youtubeChannel} className={buttonClasses(variant, tone, className)}>
        <Icon name="play" className="size-5" />
        {label}
      </a>
    );
  }
  return (
    <span
      data-placeholder
      className={`inline-flex min-h-12 flex-wrap items-center justify-center gap-2 rounded-button border-2 border-dashed border-fg-link px-5 py-2 text-base font-semibold text-fg sm:min-h-13 ${className}`}
    >
      <Icon name="play" className="size-5" />
      {label}
      <span className="font-mono text-sm font-normal">[CHANNEL LINK]</span>
    </span>
  );
}

/** "Subscribe on YouTube" as a secondary button, or its placeholder. */
export function YouTubeSubscribeButton({ tone = "light" }: { tone?: ButtonTone }) {
  return <YouTubeChannelButton label="Subscribe on YouTube" tone={tone} />;
}

/** Accessible name for an account, such as "House of Bread on Instagram". */
export function accountLabel(account: SocialAccount): string {
  const base = `House of Bread on ${platformName[account.platform]}`;
  // Two YouTube channels: tell the pastor's apart from the ministry's.
  return account.platform === "youtube" && account.owner === "pastor" ? `${base} (pastor's channel)` : base;
}

/** Visible name: the platform, plus "pastor's channel" for the second YouTube. */
function visibleName(account: SocialAccount): string {
  const name = platformName[account.platform];
  return account.platform === "youtube" && account.owner === "pastor" ? `${name}, pastor's channel` : name;
}

const tileClasses =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-soft";

/**
 * The social accounts from siteConfig.links.social, each a brand mark in a
 * 44px white round tile. "icons" is a wrapping row of tiles (the footer);
 * "labelled" adds the platform name beside each tile (the Library page).
 * Links open in a new tab with rel="noopener noreferrer".
 */
export function SocialLinks({ variant = "icons" }: { variant?: "icons" | "labelled" }) {
  const { social } = siteConfig.links;

  if (social.length === 0) {
    return (
      <span data-placeholder className={`${pending} flex-wrap`}>
        <PlaceholderBadge />
        [SOCIAL PLATFORMS AND LINKS TO BE SUPPLIED]
      </span>
    );
  }

  if (variant === "labelled") {
    return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {social.map((account) => (
          <li key={account.href}>
            <a
              href={account.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${accountLabel(account)} (opens in a new tab)`}
              className="flex min-h-16 items-center gap-4 rounded-card border border-border bg-surface px-4 py-3 font-semibold text-ink shadow-soft hover:border-border-strong"
            >
              <span className={tileClasses}>
                <SocialIcon platform={account.platform} />
              </span>
              {visibleName(account)}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2.5">
      {social.map((account) => (
        <li key={account.href}>
          <a
            href={account.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${accountLabel(account)} (opens in a new tab)`}
            className={`${tileClasses} hover:border-border-strong`}
          >
            <SocialIcon platform={account.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}

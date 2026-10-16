import { siteConfig } from "@/lib/site-config";
import { buttonClasses, type ButtonTone } from "./Button";
import { Icon } from "./icons";
import { PlaceholderBadge } from "./Placeholder";

const tile =
  "inline-flex min-h-12 items-center gap-3 rounded-button border-2 px-5 py-2 font-semibold";
const pending = `${tile} border-dashed border-fg-link font-mono text-sm font-normal text-fg`;

/**
 * "Subscribe on YouTube" as a secondary button, or a marked placeholder in
 * the button's shape until the channel link is supplied.
 */
export function YouTubeSubscribeButton({ tone = "light" }: { tone?: ButtonTone }) {
  const { youtubeChannel } = siteConfig.links;
  if (youtubeChannel) {
    return (
      <a href={youtubeChannel} className={buttonClasses("secondary", tone)}>
        <Icon name="play" className="size-5" />
        Subscribe on YouTube
      </a>
    );
  }
  return (
    <span
      data-placeholder
      className="inline-flex min-h-12 flex-wrap items-center justify-center gap-2 rounded-button border-2 border-dashed border-fg-link px-5 py-2 text-base font-semibold text-fg sm:min-h-13"
    >
      <Icon name="play" className="size-5" />
      Subscribe on YouTube
      <span className="font-mono text-sm font-normal">[CHANNEL LINK]</span>
    </span>
  );
}

/**
 * The ministry's social pages. No address is invented: until the ministry
 * supplies them, each renders as a marked placeholder in the link's place.
 * TODO: fill siteConfig.links from the ministry.
 */
export function SocialLinks({ layout = "row" }: { layout?: "row" | "column" }) {
  const { youtubeChannel, social } = siteConfig.links;
  const list = layout === "row" ? "flex flex-wrap gap-3" : "flex flex-col items-start gap-3";
  const live = `${tile} border-fg-link text-fg-link hover:bg-[var(--chip-fill)]`;

  return (
    <ul className={list}>
      <li>
        {youtubeChannel ? (
          <a href={youtubeChannel} className={live}>
            <Icon name="play" className="size-5" />
            YouTube
          </a>
        ) : (
          <span data-placeholder className={pending}>
            <Icon name="play" className="size-5" />
            YouTube [CHANNEL LINK]
          </span>
        )}
      </li>
      {social.length > 0 ? (
        social.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={live}>
              <Icon name="share" className="size-5" />
              {item.label}
            </a>
          </li>
        ))
      ) : (
        <li>
          <span data-placeholder className={`${pending} flex-wrap`}>
            <PlaceholderBadge />
            [OTHER SOCIAL PLATFORMS AND LINKS TO BE SUPPLIED]
          </span>
        </li>
      )}
    </ul>
  );
}

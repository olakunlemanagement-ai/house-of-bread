import { isNewsletterEnabled } from "@/lib/newsletter/config";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import type { FieldTone } from "./forms";
import { NewsletterFormClient } from "./NewsletterFormClient";

type NewsletterFormProps = {
  /** Unique per page, so field ids do not collide. */
  idPrefix: string;
  /** Recorded as a Kit tag, so signups can be traced to where they came from. */
  source: NewsletterSource;
  tone?: FieldTone;
  /** Adds the "Remind me before each live session" checkbox. */
  withLiveNotify?: boolean;
  consent?: "standard" | "short";
};

/**
 * Newsletter signup. The one form used everywhere. Checks on the server
 * whether Kit is configured, so the API key never reaches the browser, and
 * renders the disabled "opens soon" form until it is.
 */
export function NewsletterForm({
  idPrefix,
  source,
  tone = "light",
  withLiveNotify = false,
  consent = "standard",
}: NewsletterFormProps) {
  return (
    <NewsletterFormClient
      idPrefix={idPrefix}
      source={source}
      tone={tone}
      withLiveNotify={withLiveNotify}
      consent={consent}
      enabled={isNewsletterEnabled()}
    />
  );
}

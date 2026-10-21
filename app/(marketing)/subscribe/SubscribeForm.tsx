import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { subscribePageSource, type NewsletterSource } from "@/lib/newsletter/schema";

/** The signup form on /subscribe, tagged with the given source. */
export function SubscribeForm({ source = "subscribe-page" }: { source?: NewsletterSource }) {
  return <NewsletterForm idPrefix="subscribe" source={source} withLiveNotify consent="short" />;
}

/**
 * Reads ?source= (such as academy-waitlist from the Academy page) and tags
 * the signup with it. Rendered inside Suspense with a plain SubscribeForm as
 * the fallback, so the page stays static and the form works without
 * JavaScript, where the signup is tagged subscribe-page instead.
 */
export async function SourcedSubscribeForm({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { source } = await searchParams;
  return <SubscribeForm source={subscribePageSource(source)} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { findBySlug, placeholderEvents } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderEvents.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(placeholderEvents, slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.description };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const entry = findBySlug(placeholderEvents, slug);
  if (!entry) notFound();

  return (
    <PlaceholderPage
      title={entry.title}
      description="Placeholder event. Final content will come from the MDX content pipeline."
    />
  );
}

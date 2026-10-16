import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { findBySlug, placeholderBooks } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderBooks.map((entry) => ({ book: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/new-testament/[book]">): Promise<Metadata> {
  const { book } = await params;
  const entry = findBySlug(placeholderBooks, book);
  if (!entry) return {};
  return { title: entry.title, description: entry.description };
}

export default async function BookPage({ params }: PageProps<"/new-testament/[book]">) {
  const { book } = await params;
  const entry = findBySlug(placeholderBooks, book);
  if (!entry) notFound();

  return (
    <PlaceholderPage
      title={entry.title}
      description="Placeholder book explanation. Final content will come from the MDX content pipeline."
    />
  );
}

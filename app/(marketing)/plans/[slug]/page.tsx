import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { findBySlug, placeholderPlans } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderPlans.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/plans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(placeholderPlans, slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.description };
}

export default async function PlanPage({ params }: PageProps<"/plans/[slug]">) {
  const { slug } = await params;
  const entry = findBySlug(placeholderPlans, slug);
  if (!entry) notFound();

  return (
    <PlaceholderPage
      title={entry.title}
      description="Placeholder reading plan. Final content will come from the MDX content pipeline."
    />
  );
}

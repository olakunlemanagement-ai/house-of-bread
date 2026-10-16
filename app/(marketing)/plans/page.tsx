import type { Metadata } from "next";
import { PlaceholderList } from "@/components/shared/PlaceholderList";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { placeholderPlans } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Reading plans",
  description: "Placeholder reading plan index.",
};

export default function PlansPage() {
  return (
    <PlaceholderPage
      title="Reading plans"
      description="Placeholder reading plan index. Each plan will be listed here."
    >
      <PlaceholderList
        heading="Sample plans"
        items={placeholderPlans.map((entry) => ({
          href: `/plans/${entry.slug}`,
          title: entry.title,
        }))}
      />
    </PlaceholderPage>
  );
}

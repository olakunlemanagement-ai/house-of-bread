import type { Metadata } from "next";
import { PlaceholderList } from "@/components/shared/PlaceholderList";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { placeholderTeachings } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Teachings",
  description: "Placeholder teachings archive.",
};

export default function TeachingsPage() {
  return (
    <PlaceholderPage
      title="Teachings"
      description="Placeholder teachings archive. A filterable index of teachings will appear here."
    >
      <PlaceholderList
        heading="Sample teachings"
        items={placeholderTeachings.map((entry) => ({
          href: `/teachings/${entry.slug}`,
          title: entry.title,
        }))}
      />
    </PlaceholderPage>
  );
}

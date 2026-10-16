import type { Metadata } from "next";
import { PlaceholderList } from "@/components/shared/PlaceholderList";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { placeholderClasses } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Classes and training",
  description: "Placeholder classes page.",
};

export default function ClassesPage() {
  return (
    <PlaceholderPage
      title="Classes and training"
      description="Placeholder classes page. An overview of classes and training will appear here."
    >
      <PlaceholderList
        heading="Sample classes"
        items={placeholderClasses.map((entry) => ({
          href: `/classes/${entry.slug}`,
          title: entry.title,
        }))}
      />
    </PlaceholderPage>
  );
}

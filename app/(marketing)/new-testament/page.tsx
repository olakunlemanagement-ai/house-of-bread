import type { Metadata } from "next";
import { PlaceholderList } from "@/components/shared/PlaceholderList";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { placeholderBooks } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "New Testament",
  description: "Placeholder book index.",
};

export default function NewTestamentPage() {
  return (
    <PlaceholderPage
      title="New Testament"
      description="Placeholder book index. Explanations of each New Testament book will be listed here."
    >
      <PlaceholderList
        heading="Sample books"
        items={placeholderBooks.map((entry) => ({
          href: `/new-testament/${entry.slug}`,
          title: entry.title,
        }))}
      />
    </PlaceholderPage>
  );
}

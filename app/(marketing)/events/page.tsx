import type { Metadata } from "next";
import { PlaceholderList } from "@/components/shared/PlaceholderList";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { placeholderEvents } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Events",
  description: "Placeholder events page.",
};

export default function EventsPage() {
  return (
    <PlaceholderPage
      title="Events"
      description="Placeholder events page. Live sessions, trainings, meetings and the schedule will appear here."
    >
      <PlaceholderList
        heading="Sample events"
        items={placeholderEvents.map((entry) => ({
          href: `/events/${entry.slug}`,
          title: entry.title,
        }))}
      />
    </PlaceholderPage>
  );
}

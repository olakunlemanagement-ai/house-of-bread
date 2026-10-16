import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Placeholder newsletter page.",
};

export default function SubscribePage() {
  return (
    <PlaceholderPage
      title="Newsletter"
      description="Placeholder newsletter page. The signup form, consent wording and privacy link will appear here."
    />
  );
}

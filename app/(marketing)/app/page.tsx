import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "The app",
  description: "Placeholder app page.",
};

export default function AppPage() {
  return (
    <PlaceholderPage
      title="The app"
      description="Placeholder app page. App details and store links will appear here once confirmed."
    />
  );
}

import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global" },
  description: "Placeholder home page.",
};

export default function HomePage() {
  return (
    <PlaceholderPage
      title="House of Bread Global"
      description="Placeholder home page. The next live session, newsletter signup and app call to action will appear here."
    />
  );
}

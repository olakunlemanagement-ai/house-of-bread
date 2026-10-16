import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "About",
  description: "Placeholder about page.",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About"
      description="Placeholder about page. The ministry, the teacher and the doctrinal position will be described here."
    />
  );
}

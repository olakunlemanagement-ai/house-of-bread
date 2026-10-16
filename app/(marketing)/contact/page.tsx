import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Placeholder contact page.",
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact"
      description="Placeholder contact page. The contact form will appear here."
    />
  );
}

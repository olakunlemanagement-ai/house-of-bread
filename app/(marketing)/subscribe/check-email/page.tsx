import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Check your email",
  description: "Placeholder confirmation page.",
  // Never indexed, whatever the global flag says. This page only makes sense
  // straight after a signup.
  robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
  return (
    <PlaceholderPage
      title="Check your email"
      description="Placeholder confirmation page. Wording asking the visitor to confirm their subscription will appear here."
    />
  );
}

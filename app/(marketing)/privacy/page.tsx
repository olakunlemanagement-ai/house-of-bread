import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Placeholder privacy policy.",
};

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Privacy policy"
      description="Placeholder privacy policy. The final policy, covering UK GDPR and the Nigeria Data Protection Act, will appear here."
    />
  );
}

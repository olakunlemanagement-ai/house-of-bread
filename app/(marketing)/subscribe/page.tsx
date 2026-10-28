import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { SignupSection } from "./SubscribeForm";

export const metadata: Metadata = {
  title: "New teaching in your inbox",
  description: "One email when something new is ready from House of Bread Global. Nothing else.",
};

/**
 * Subscribe, per docs/RESET-BRIEF.md section 5: "New teaching in your
 * inbox", the brief's line, the signup form with its consent wording, then
 * the next step to the Academy.
 */
export default function SubscribePage({ searchParams }: PageProps<"/subscribe">) {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="bread-steam"
        eyebrow="Newsletter"
        title="New teaching in your inbox"
        lead="One email when something new is ready. Nothing else."
      />

      <SignupSection source="subscribe-page" idPrefix="subscribe" searchParams={searchParams} />

      <NextStep title="Want to start now?" text="Our free courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse free courses</ButtonLink>
      </NextStep>
    </main>
  );
}

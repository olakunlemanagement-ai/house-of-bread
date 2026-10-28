import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/shared/Button";
import { IconTile, type IconName } from "@/components/shared/icons";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { bandClass, SectionHeader } from "@/components/shared/Section";
import { AskError } from "./AskError";
import { AskForm } from "./AskForm";

export const metadata: Metadata = {
  title: "Ask a question about the Bible",
  description:
    "Ask a question about the Bible. No name or email needed. Every question is read, and some are answered in the teaching.",
};

const points: { icon: IconName; text: string }[] = [
  { icon: "people", text: "No name, email or phone number is asked for." },
  { icon: "mail", text: "The question is emailed to the ministry as plain text." },
  { icon: "alert", text: "Leave out anything that could identify you or someone else." },
];

export default function AskPage({ searchParams }: PageProps<"/ask">) {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="dust-light"
        eyebrow="Ask"
        title="Ask a question about the Bible"
        lead="No name or email needed. We read every question, and some are answered in our teaching."
      />

      <section id="ask-form" aria-labelledby="ask-form-heading" className="scroll-mt-6 bg-surface">
        <div className={`${bandClass} grid gap-8 lg:grid-cols-12 lg:gap-10`}>
          <div className="rounded-card border border-border bg-surface-raised p-6 shadow-soft sm:p-10 lg:col-span-7">
            <h2 id="ask-form-heading" className="mb-8 text-3xl">
              Send a question
            </h2>
            <Suspense fallback={null}>
              <AskError searchParams={searchParams} />
            </Suspense>
            <AskForm />
          </div>

          <aside aria-labelledby="ask-how-heading" className="rounded-card bg-surface-mint p-6 sm:p-10 lg:col-span-5 lg:self-start">
            <SectionHeader id="ask-how-heading" size="compact" as="h2">
              Asking anonymously
            </SectionHeader>
            <ul className="mt-8 space-y-5">
              {points.map((point) => (
                <li key={point.text} className="flex items-center gap-4 text-lg text-ink">
                  <IconTile name={point.icon} />
                  {point.text}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-ink">
              <Placeholder>[CONFIRM HOW QUESTIONS ARE ANSWERED]</Placeholder>
            </p>
          </aside>
        </div>
      </section>

      <NextStep tone="warm" title="Need a word for this season?" text="Sit under the teaching of the Word, wherever you are.">
        <ButtonLink href="/media">Watch the latest teaching</ButtonLink>
      </NextStep>
    </main>
  );
}

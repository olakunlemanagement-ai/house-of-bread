import type { Metadata } from "next";
import { TextCTA } from "@/components/shared/TextCTA";
import { IconTile } from "@/components/shared/icons";
import { questionMessages } from "@/lib/questions/messages";

export const metadata: Metadata = {
  title: "Question sent",
  description: questionMessages.success,
  // Never indexed. This page only makes sense straight after sending.
  robots: { index: false, follow: false },
};

/** Where a question posted without JavaScript lands. */
export default function AskSentPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <div className="container-page pb-20 pt-20 md:pb-32 md:pt-32">
        <div className="max-w-2xl">
          <IconTile name="check" size="lg" />
          <h1 className="mt-8 text-display">{questionMessages.successHeading}</h1>
          <p className="mt-6 text-lead text-ink">{questionMessages.success}</p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:gap-10">
            <TextCTA href="/ask">Ask another question</TextCTA>
            <TextCTA href="/" direction="back">
              Back to the home page
            </TextCTA>
          </div>
        </div>
      </div>
    </main>
  );
}

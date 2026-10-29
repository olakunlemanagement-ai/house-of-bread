import type { CSSProperties } from "react";
import type { ImageSlotId } from "@/lib/media/image-slots";
import { ImageSlot } from "./ImageSlot";
import { RiseReveal } from "./RiseReveal";

export type BeliefCard = { slot: ImageSlotId; title: string; text: string };

/**
 * About's "What we believe": Home's card look (StartingCards) without
 * buttons, because nothing here asks the visitor to act. One column on
 * phones, two from sm, four from lg. The cards rise in once, 90ms apart,
 * as they scroll into view (RiseReveal); still without JavaScript, with
 * Motion Off or reduced motion.
 */
export function BeliefCards({ cards }: { cards: BeliefCard[] }) {
  return (
    <RiseReveal className="rise grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {cards.map((card, index) => (
        <li
          key={card.slot}
          style={{ "--i": index } as CSSProperties}
          className="mx-auto flex w-full max-w-md flex-col rounded-[2rem] border border-border bg-surface-raised p-3 shadow-raised sm:max-w-none"
        >
          <ImageSlot id={card.slot} sizes="(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 28rem" />
          <div className="flex flex-1 flex-col px-2 pb-3 pt-5 sm:px-3">
            <p aria-hidden="true" className="font-serif text-2xl leading-none text-emerald-deep">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-xl leading-snug">{card.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-muted">{card.text}</p>
          </div>
        </li>
      ))}
    </RiseReveal>
  );
}

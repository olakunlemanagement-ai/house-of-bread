import type { Route } from "next";
import type { Course } from "@/lib/academy/types";
import type { ImageSlotId } from "@/lib/media/image-slots";
import { ButtonLink } from "./Button";
import { FanReveal } from "./FanReveal";
import { ImageSlot } from "./ImageSlot";
import { RevealHeading } from "./RevealHeading";

type StartingCard = {
  slot: ImageSlotId;
  title: string;
  text: string;
  href: Route;
  action: string;
};

/**
 * Home's "Where are you starting from?", as cards in a fan: one soft mint
 * panel, the heading centred, three cards. From md the middle card stands
 * in front and raised, the side cards turned a little behind it; they fan
 * out from a stack once as they scroll in (FanReveal), and a hovered card
 * lifts a little. Phones stack the same cards with no fan. Motion Off and
 * reduced motion: a still fan, nothing lifts. Each card carries an image
 * slot, its number, title, line and button. Cards 01 and 02 open the first
 * and second courses in the catalogue, stand-ins until the ministry names
 * the [foundations course] and the [book-by-book course]; 03 opens Ask.
 * The Academy keeps the same three as numbered rows (StartingRows).
 */
export function StartingCards({ courses }: { courses: Course[] }) {
  const courseHref = (index: number): Route =>
    courses[index] ? (`/academy/${courses[index].slug}` as Route) : "/academy";
  const cards: StartingCard[] = [
    {
      slot: "home-start-new",
      title: "New to the Bible.",
      text: "Start with the foundations: what the Bible is and how to read it.",
      href: courseHref(0),
      action: "Start this course",
    },
    {
      slot: "home-start-connect",
      title: "You know the stories, but not how they connect.",
      text: "Go book by book and see the whole picture.",
      href: courseHref(1),
      action: "Start this course",
    },
    {
      slot: "home-start-question",
      title: "You're carrying a question.",
      text: "Ask it. You don't need to give your name.",
      href: "/ask",
      action: "Ask a question",
    },
  ];

  return (
    <div className="rounded-[2rem] bg-surface-mint px-4 py-10 sm:px-8 md:px-10 md:pb-24 md:pt-16 lg:rounded-[2.5rem]">
      <RevealHeading
        id="start-heading"
        className="mx-auto max-w-3xl text-center text-h2"
        text="Where are you starting from?"
      />
      <FanReveal className="fan mt-8 flex flex-col gap-4 md:mt-14 md:flex-row md:items-stretch md:justify-center md:gap-0">
        {cards.map((card, index) => (
          <li
            key={card.slot}
            data-pos={index === 0 ? "left" : index === 1 ? "mid" : "right"}
            className="fan-card flex flex-col rounded-[2rem] border border-border bg-surface-raised p-3 shadow-raised md:w-56 lg:w-80"
          >
            <ImageSlot id={card.slot} sizes="(min-width: 1024px) 20rem, (min-width: 768px) 14rem, 100vw" />
            <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3">
              <p aria-hidden="true" className="font-serif text-2xl leading-none text-emerald-deep">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl leading-snug">{card.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-muted">{card.text}</p>
              <div className="mt-auto pt-5">
                <ButtonLink href={card.href} variant="tertiary" size="sm" className="w-full">
                  {card.action}
                  {card.action === "Start this course" ? <span className="sr-only">: {card.title}</span> : null}
                </ButtonLink>
              </div>
            </div>
          </li>
        ))}
      </FanReveal>
    </div>
  );
}

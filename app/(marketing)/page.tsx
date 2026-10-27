import type { Metadata, Route } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "@/components/shared/Button";
import { CourseCard } from "@/components/shared/CourseCard";
import { Hero } from "@/components/shared/Hero";
import { HomeTeachings, HomeTeachingsSkeleton } from "@/components/shared/HomeTeachings";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { NumberedRows } from "@/components/shared/NumberedRows";
import { Placeholder } from "@/components/shared/Placeholder";
import { StoreButtons } from "@/components/shared/StoreButtons";
import { TextCTA } from "@/components/shared/TextCTA";
import { courseCatalog } from "@/lib/academy";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global | Understand the Bible you've been reading" },
  description: siteConfig.description,
};

// One rhythm for every Home section: 48px on phones, 112px from md.
const band = "container-page reveal py-12 md:py-28";

/**
 * Home, seven screens in the order of docs/RESET-BRIEF.md section 4, copy
 * word for word. One idea and one primary button per screen. Section tints
 * alternate white, cream and pale green, one per section.
 */
export default async function HomePage() {
  const courses = await courseCatalog.listCourses();
  // Stand-ins until the ministry names the [foundations course] and the
  // [book-by-book course]: the first and second courses in the catalogue.
  const courseHref = (index: number): Route =>
    courses[index] ? (`/academy/${courses[index].slug}` as Route) : "/academy";

  return (
    <main id="main" tabIndex={-1}>
      {/* Screen 1: hero. */}
      <Hero />

      {/* Screen 2: the mission, a statement. */}
      <section aria-labelledby="mission-heading" className="bg-surface-warm">
        <div className={band}>
          <h2 id="mission-heading" className="max-w-5xl text-statement">
            We teach believers to read God&apos;s Word accurately, understand it deeply, and live it
            fully, wherever they are.
          </h2>
          <p className="mt-8 max-w-2xl text-lead text-ink-muted">
            The name comes from Bethlehem, the house of bread, where the Bread of Life was born.
          </p>
          <p className="mt-5">
            <TextCTA href="/about">Read our story</TextCTA>
          </p>
        </div>
      </section>

      {/* Screen 3: the Academy, the main action. */}
      <section id="academy" aria-labelledby="academy-heading" className="bg-surface">
        <div className={band}>
          <div className="max-w-3xl">
            <p className="eyebrow">The Academy</p>
            <h2 id="academy-heading" className="mt-4 text-h2">
              Read the Bible for years and still feel you only know it in parts?
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              Our free courses take you through it, one lesson at a time.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 md:mt-12 md:gap-5 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </ul>
          <p className="mt-8">
            <TextCTA href="/academy">Browse all free courses</TextCTA>
          </p>
        </div>
      </section>

      {/* Screen 4: where are you starting from? */}
      <section aria-labelledby="start-heading" className="bg-surface-mint">
        <div className={band}>
          <h2 id="start-heading" className="max-w-3xl text-h2">
            Where are you starting from?
          </h2>
          <NumberedRows
            className="mt-8 md:mt-12"
            items={[
              {
                title: "New to the Bible.",
                text: "Start with the foundations: what the Bible is and how to read it.",
                href: courseHref(0),
              },
              {
                title: "You know the stories, but not how they connect.",
                text: "Go book by book and see the whole picture.",
                href: courseHref(1),
              },
              {
                title: "You're carrying a question.",
                text: "Ask it. You don't need to give your name.",
                href: "/ask",
              },
            ]}
          />
        </div>
      </section>

      {/* Screen 5: teachings. The live line is the only mention of live meetings on Home. */}
      <section id="teachings" aria-labelledby="teachings-heading" className="bg-surface">
        <div className={band}>
          <div className="max-w-3xl">
            <h2 id="teachings-heading" className="text-h2">
              Need a word for this season?
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              Sit under the teaching of the Word, wherever you are.
            </p>
          </div>
          {/* The async region: its height must match the skeleton's (scripts/check-noscript.mjs). */}
          <div data-region="home-teachings" className="mt-10 md:mt-12">
            <Suspense fallback={<HomeTeachingsSkeleton />}>
              <HomeTeachings />
            </Suspense>
          </div>
          <div className="mt-10">
            <ButtonLink href="/media" className="w-full sm:w-auto">
              See all teachings
            </ButtonLink>
          </div>
          <p className="mt-6 text-base text-ink-muted">
            New teaching live every Monday at 8 pm Lagos time.{" "}
            <Link href={"/events#rhythm" as Route} className="link-inline whitespace-nowrap">
              See the session times
            </Link>
          </p>
        </div>
      </section>

      {/* Screen 6: the teacher. */}
      <section aria-labelledby="teacher-heading" className="bg-surface-warm">
        <div className={`${band} grid grid-cols-[6.5rem_1fr] items-start gap-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center md:gap-14 lg:grid-cols-[minmax(0,20rem)_1fr]`}>
          <ImageSlot
            id="home-teacher"
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 14rem, 7rem"
          />
          <div>
            <h2 id="teacher-heading" className="sr-only">
              The teacher
            </h2>
            <p className="max-w-2xl font-serif text-xl leading-snug text-ink sm:text-2xl md:text-3xl md:leading-snug">
              Taught by Isaac Ola, team leader of{" "}
              <Placeholder>[House of Bread Ministries International]</Placeholder>. He teaches Scripture
              verse by verse, with care for what the text actually says.
            </p>
            <div className="col-span-2 flex flex-col items-start gap-1 sm:col-span-1 sm:mt-6 sm:flex-row sm:gap-8">
              <TextCTA href="/about">Read our story</TextCTA>
              <TextCTA href={"/about#handled" as Route}>What we believe</TextCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Screen 7: the app, just before the footer. */}
      <section aria-labelledby="app-heading" className="bg-surface-mint">
        <div className={band}>
          <h2 id="app-heading" className="max-w-3xl text-h2">
            Take the Word with you.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-ink-muted">
            Daily reading and journeys through the New Testament, in your pocket.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/app" className="w-full sm:w-auto">
              Get the app
            </ButtonLink>
            <StoreButtons hideMissing />
          </div>
        </div>
      </section>
    </main>
  );
}

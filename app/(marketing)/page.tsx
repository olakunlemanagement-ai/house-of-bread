import type { Metadata, Route } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/shared/Button";
import { CourseCard } from "@/components/shared/CourseCard";
import { Hero } from "@/components/shared/Hero";
import { HomeTeachings, HomeTeachingsSkeleton } from "@/components/shared/HomeTeachings";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { LiveLine } from "@/components/shared/LiveLine";
import { Placeholder } from "@/components/shared/Placeholder";
import { StoreButtons } from "@/components/shared/StoreButtons";
import { RevealHeading } from "@/components/shared/RevealHeading";
import { bandClass as band } from "@/components/shared/Section";
import { StartingRows } from "@/components/shared/StartingRows";
import { Typewriter } from "@/components/shared/Typewriter";
import { courseCatalog } from "@/lib/academy";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global | Understand the Bible you've been reading" },
  description: siteConfig.description,
};

/**
 * Home, seven screens in the order of docs/RESET-BRIEF.md section 4, copy
 * word for word. One idea and one primary button per screen. Section tints
 * alternate white, cream and pale green, one per section. Every call to
 * action is a button. The mission types itself out once; section headings
 * reveal line by line once.
 */
export default async function HomePage() {
  const courses = await courseCatalog.listCourses();

  return (
    <main id="main" tabIndex={-1}>
      {/* Screen 1: hero. */}
      <Hero />

      {/* Screen 2: the mission, a statement. */}
      <section aria-labelledby="mission-heading" className="bg-surface-warm">
        <div className={band}>
          <Typewriter
            id="mission-heading"
            className="max-w-[72rem] text-mission"
            text="We teach believers to read God's Word accurately, understand it deeply, and live it fully, wherever they are."
          />
          <p className="mt-6 max-w-2xl text-lead text-ink-muted md:mt-8">
            The name comes from Bethlehem, the house of bread, where the Bread of Life was born.
          </p>
          <ButtonLink href="/about" variant="secondary" className="mt-6 w-full sm:w-auto">
            Read our story
          </ButtonLink>
        </div>
      </section>

      {/* Screen 3: the Academy, the main action. */}
      <section id="academy" aria-labelledby="academy-heading" className="bg-surface">
        <div className={band}>
          <div className="max-w-3xl">
            <p className="eyebrow">The Academy</p>
            <RevealHeading
              id="academy-heading"
              className="mt-4 text-h2"
              text="Read the Bible for years and still feel you only know it in parts?"
            />
            <p className="mt-4 text-lead text-ink-muted">
              Our free courses take you through it, one lesson at a time.
            </p>
          </div>
          {/* Two courses on phones, three from md. */}
          <ul className="mt-6 grid gap-4 md:mt-12 md:gap-5 lg:grid-cols-3 max-md:[&>li:nth-child(n+3)]:hidden">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </ul>
          <ButtonLink href="/academy" className="mt-6 w-full sm:w-auto md:mt-8">
            Browse all free courses
          </ButtonLink>
        </div>
      </section>

      {/* Screen 4: where are you starting from? */}
      <section aria-labelledby="start-heading" className="bg-surface-mint">
        <div className={band}>
          <RevealHeading id="start-heading" className="max-w-3xl text-h2" text="Where are you starting from?" />
          <StartingRows courses={courses} className="mt-6 md:mt-12" />
        </div>
      </section>

      {/* Screen 5: teachings. The live line is the only mention of live meetings on Home. */}
      <section id="teachings" aria-labelledby="teachings-heading" className="bg-surface">
        <div className={band}>
          <div className="max-w-3xl">
            <RevealHeading id="teachings-heading" className="text-h2" text="Need a word for this season?" />
            <p className="mt-4 text-lead text-ink-muted">
              Sit under the teaching of the Word, wherever you are.
            </p>
          </div>
          {/* The async region: its height must match the skeleton's (scripts/check-noscript.mjs). */}
          <div data-region="home-teachings" className="mt-8 md:mt-12">
            <Suspense fallback={<HomeTeachingsSkeleton />}>
              <HomeTeachings />
            </Suspense>
          </div>
          <div className="mt-8 md:mt-10">
            <ButtonLink href="/media" className="w-full sm:w-auto">
              See all teachings
            </ButtonLink>
          </div>
          <LiveLine className="mt-6 md:mt-8" />
        </div>
      </section>

      {/* Screen 6: the teacher. */}
      <section aria-labelledby="teacher-heading" className="bg-surface-warm">
        {/* Phones: the photo full width above the text (brief, screen 6). From sm: side by side. */}
        <div className={`${band} grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center md:gap-14 lg:grid-cols-[minmax(0,20rem)_1fr]`}>
          <ImageSlot
            id="home-teacher"
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 14rem, 100vw"
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/about" variant="secondary" className="w-full sm:w-auto">
                Read our story
              </ButtonLink>
              <ButtonLink href={"/about#beliefs" as Route} variant="secondary" className="w-full sm:w-auto">
                What we believe
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Screen 7: the app, just before the footer. */}
      <section aria-labelledby="app-heading" className="bg-surface-mint">
        <div className={band}>
          <RevealHeading id="app-heading" className="max-w-3xl text-h2" text="Take the Word with you." />
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

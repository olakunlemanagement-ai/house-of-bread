import type { Metadata, Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { StartingCards } from "@/components/shared/StartingCards";
import { courseCatalog } from "@/lib/academy";
import { academyCopy as copy } from "@/lib/content/copy";
import { CategoryNav } from "./_components/CategoryNav";
import { CourseRow } from "./_components/CourseRow";
import { StartHereCard } from "./_components/StartHereCard";

export const metadata: Metadata = {
  title: "Bible courses",
  description:
    "Self-paced video lessons that take you through Scripture in context. Browse every course by category, or start with the one for newcomers.",
};

/**
 * The Academy catalogue, in the shape of BibleProject's Classroom
 * (docs/research/BIBLEPROJECT-CLASSROOM.md) in the house design: the full
 * screen hero, then "Find a course": from lg the category list and the
 * Start Here card in a sticky column beside every category's course rows;
 * below lg the categories as chips, the Start Here card, then the rows.
 * Then "Where are you starting from?" (Home's fan) and the next step.
 */
export default async function AcademyPage() {
  const [categories, courses] = await Promise.all([courseCatalog.listCategories(), courseCatalog.listCourses()]);
  const startHere = courses.find((course) => course.startHere);
  const groups = categories
    .map((category) => ({ category, courses: courses.filter((course) => course.category === category.slug) }))
    .filter((group) => group.courses.length > 0);
  const startHref = startHere ? (`/academy/${startHere.slug}` as Route) : "/academy";

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        phoneLoop
        eyebrow="The Academy"
        title="Bible courses"
        lead="Self-paced video lessons that take you through Scripture in context."
        actions={
          <>
            <ButtonLink href="#courses">See all courses</ButtonLink>
            <ButtonLink href={startHref} variant="secondary">
              Start here
            </ButtonLink>
          </>
        }
      />

      <Section id="courses" title="Find a course">
        {groups.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <aside aria-label="Categories and where to start" className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start lg:gap-8">
              <CategoryNav categories={groups.map(({ category }) => ({ slug: category.slug, title: category.title }))} />
              {startHere ? (
                <div className="max-w-md lg:max-w-none">
                  <StartHereCard course={startHere} />
                </div>
              ) : null}
            </aside>
            <div className="flex flex-col gap-10 md:gap-14">
              {groups.map(({ category, courses: inCategory }) => (
                <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-heading`} className="scroll-mt-8">
                  <h3 id={`${category.slug}-heading`} className="text-2xl leading-tight sm:text-[1.75rem]">
                    {category.title}
                  </h3>
                  <ul className="mt-5 flex flex-col gap-4">
                    {inCategory.map((course) => (
                      <CourseRow key={course.slug} course={course} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState icon="book" action={{ href: copy.waitlistHref, label: copy.waitlistLabel }}>
            The first courses are being prepared.
          </EmptyState>
        )}
      </Section>

      <section aria-labelledby="start-heading" className="bg-surface">
        <div className="container-page pb-10 md:pb-28">
          <StartingCards courses={courses} />
        </div>
      </section>

      <NextStep
        tone="warm"
        title={startHere ? `Not sure where to begin? Start with ${startHere.title}.` : "Not sure where to begin?"}
      >
        <ButtonLink href={startHref}>
          Start this course
          {startHere ? <span className="sr-only">: {startHere.title}</span> : null}
        </ButtonLink>
      </NextStep>
    </main>
  );
}

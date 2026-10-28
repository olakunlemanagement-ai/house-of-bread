import type { Metadata, Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { CourseCard } from "@/components/shared/CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { StartingRows } from "@/components/shared/StartingRows";
import { courseCatalog } from "@/lib/academy";
import { academyCopy as copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: "Free Bible courses",
  description:
    "Self-paced video lessons that take you through Scripture in context. Free, always. Find where you are starting from and choose a course.",
};

/**
 * The Academy, per docs/RESET-BRIEF.md section 5: the heading and line,
 * "Where are you starting from?" rows as on Home, then every course as a
 * card, then the next step. The open or closed status line and the
 * "Notify me" waitlist stay as they were until the ministry decides whether
 * courses are live at launch (docs/PLACEHOLDERS.md, launch blocker).
 */
export default async function AcademyPage() {
  const courses = await courseCatalog.listCourses();
  const first = courses[0];
  // Two columns for two or four cards, three for three, five or six.
  const courseGrid =
    courses.length % 3 === 0 || courses.length === 5 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="The Academy"
        title="Free Bible courses"
        lead="Self-paced video lessons that take you through Scripture in context. Free, always."
        meta={<p className="max-w-2xl text-base text-ink-muted">{copy.courses.intro}</p>}
        actions={<ButtonLink href={copy.waitlistHref}>{copy.waitlistLabel}</ButtonLink>}
        loop="open-bible"
        phoneLoop
      />

      <Section id="start" title="Where are you starting from?" tone="mint">
        <StartingRows courses={courses} />
      </Section>

      <Section id="courses" title="Which course will you start with?">
        {courses.length > 0 ? (
          <ul className={`grid gap-4 md:gap-5 ${courseGrid}`}>
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} showStatus />
            ))}
          </ul>
        ) : (
          <EmptyState icon="book" action={{ href: copy.waitlistHref, label: copy.waitlistLabel }}>
            The first courses are being prepared.
          </EmptyState>
        )}
      </Section>

      <NextStep
        tone="warm"
        title={
          <>
            Not sure where to begin? Start with <Placeholder>[foundations course]</Placeholder>.
          </>
        }
      >
        <ButtonLink href={first ? (`/academy/${first.slug}` as Route) : "/academy"}>
          Start this course
          {first ? <span className="sr-only">: {first.title}</span> : null}
        </ButtonLink>
      </NextStep>
    </main>
  );
}

import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/Button";
import { MdxBody } from "@/components/shared/MdxBody";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { bandClass, Section } from "@/components/shared/Section";
import { courseCatalog } from "@/lib/academy";
import { academyCopy } from "@/lib/content/copy";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const courses = await courseCatalog.listCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: PageProps<"/academy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseCatalog.getCourse(slug);
  if (!course) return {};
  return { title: `${course.title}: a Bible course`, description: course.summary };
}

const placeholderOutcomes = ["[What you'll learn, 1]", "[What you'll learn, 2]", "[What you'll learn, 3]"];
const placeholderOutline = ["[Lesson 1 title]", "[Lesson 2 title]", "[Lesson 3 title]"];

/**
 * One course, per docs/RESET-BRIEF.md section 5: title, promise, lessons
 * and time, the start button, what you'll learn, the lessons, who teaches
 * it, then the next course. Until a course has a join link it is "Coming
 * soon" and the button is the Academy waitlist (the status copy is kept
 * until the launch decision in docs/PLACEHOLDERS.md).
 */
export default async function CoursePage({ params }: PageProps<"/academy/[slug]">) {
  const { slug } = await params;
  const course = await courseCatalog.getCourse(slug);
  if (!course) notFound();

  const courses = await courseCatalog.listCourses();
  const index = courses.findIndex((item) => item.slug === course.slug);
  const next = courses[index + 1];
  const open = course.status === "open" && course.joinUrl;
  const lessons = course.lessons ?? <Placeholder>[N]</Placeholder>;
  const minutes = course.minutesPerLesson ?? <Placeholder>[N]</Placeholder>;
  const outcomes = course.outcomes ?? placeholderOutcomes;
  const outline = course.outline ?? placeholderOutline;

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        eyebrow="Course"
        title={course.title}
        lead={course.summary}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base text-ink">
              {lessons} lessons · about {minutes} min each
            </p>
            {open ? null : <PlaceholderBadge label="Coming soon" />}
          </div>
        }
        actions={
          open ? (
            <ButtonLink href={course.joinUrl as `https://${string}`}>Start this course</ButtonLink>
          ) : (
            <ButtonLink href={academyCopy.waitlistHref}>{academyCopy.waitlistLabel}</ButtonLink>
          )
        }
      />

      <Section id="learn" title="What you'll learn" width="narrow">
        <MdxBody source={course.overview} />
        <ul className="mt-6 space-y-3">
          {outcomes.map((item) => (
            <li key={item} className="flex gap-3 text-lg leading-relaxed text-ink">
              <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-glyph" />
              <span>{course.outcomes ? item : <Placeholder>{item}</Placeholder>}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="lessons" title="Lessons" tone="warm" width="narrow">
        <ol className="border-b border-border">
          {outline.map((title, lesson) => (
            <li key={title} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-t border-border py-4 sm:grid-cols-[4rem_1fr]">
              <span aria-hidden="true" className="font-serif text-2xl font-medium text-emerald-deep">
                {String(lesson + 1).padStart(2, "0")}
              </span>
              <span className="text-lg leading-snug text-ink">
                {course.outline ? title : <Placeholder>{title}</Placeholder>}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <section aria-labelledby="teacher-heading" className="bg-surface">
        <div className={bandClass}>
          <h2 id="teacher-heading" className="sr-only">
            The teacher
          </h2>
          <p className="max-w-2xl font-serif text-xl leading-snug text-ink sm:text-2xl md:text-3xl md:leading-snug">
            Taught by {course.teacher ?? <Placeholder>[Isaac Ola]</Placeholder>}.
          </p>
        </div>
      </section>

      {next ? (
        <NextStep title="Ready for the next course?" text={next.title}>
          <ButtonLink href={`/academy/${next.slug}` as Route}>
            Start this course<span className="sr-only">: {next.title}</span>
          </ButtonLink>
        </NextStep>
      ) : (
        <NextStep title="Ready for the next course?">
          <ButtonLink href="/academy">Browse all courses</ButtonLink>
        </NextStep>
      )}
    </main>
  );
}

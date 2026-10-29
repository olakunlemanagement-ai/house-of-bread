import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { Tabs, type TabDef } from "@/components/academy/Tabs";
import { CourseStats, CourseTags } from "@/components/academy/CourseMeta";
import { ButtonLink } from "@/components/shared/Button";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { MdxBody } from "@/components/shared/MdxBody";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { bandClass } from "@/components/shared/Section";
import { YouTubeFacade } from "@/components/shared/YouTubeFacade";
import { courseCatalog } from "@/lib/academy";
import { CourseActions, CourseProgressBar } from "./_components/CourseProgress";
import { ResourceList } from "./_components/ResourceList";
import { SectionAccordion } from "./_components/SectionAccordion";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const courses = await courseCatalog.listCourses();
  return courses.map((course) => ({ course: course.slug }));
}

export async function generateMetadata({ params }: PageProps<"/academy/[course]">): Promise<Metadata> {
  const { course: slug } = await params;
  const course = await courseCatalog.getCourse(slug);
  if (!course) return {};
  return { title: `${course.title}: a Bible course`, description: course.summary };
}

/**
 * One course, in the shape of BibleProject's class page: the hero (title,
 * Scripture range and teacher, description, time, lessons and sections,
 * the visitor's progress, Start this course or Continue learning, and the
 * trailer when there is one) with the course image beside it. Then tabs,
 * kept in the URL: Sections (an accordion per section, its lessons as a
 * timeline), Overview (trailer, what you'll learn, the teacher) and
 * Resources (hidden when there are none). The next step is the next
 * course in the same category.
 */
export default async function CoursePage({ params }: PageProps<"/academy/[course]">) {
  const { course: slug } = await params;
  const [course, courses, categories] = await Promise.all([
    courseCatalog.getCourse(slug),
    courseCatalog.listCourses(),
    courseCatalog.listCategories(),
  ]);
  if (!course) notFound();

  const category = categories.find((item) => item.slug === course.category);
  const inCategory = courses.filter((item) => item.category === course.category);
  const next = inCategory[inCategory.findIndex((item) => item.slug === course.slug) + 1];

  const tabs: TabDef[] = [
    {
      id: "sections",
      label: "Sections",
      content: <SectionAccordion course={course.slug} sections={course.sections} />,
    },
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {course.trailerVideoId ? (
              <div id="trailer" className="scroll-mt-8">
                <h3 className="sr-only">Trailer</h3>
                <YouTubeFacade source={{ kind: "video", id: course.trailerVideoId }} title={`Trailer: ${course.title}`} />
              </div>
            ) : null}
            {course.overview.trim() ? (
              <div className={course.trailerVideoId ? "mt-8" : ""}>
                <MdxBody source={course.overview} />
              </div>
            ) : null}
            <h3 className="mt-10 text-2xl leading-tight">What you&apos;ll learn</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink-muted">After you complete this course, you will be able to:</p>
            <ul className="mt-5 space-y-3">
              {course.outcomes.map((item) => (
                <li key={item} className="flex gap-3 text-lg leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-glyph" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-card border border-border bg-surface-warm p-6 sm:p-8">
              <h3 className="text-2xl leading-tight">Meet your teacher</h3>
              <p className="mt-4 font-serif text-xl font-semibold text-ink">{course.teacher}</p>
              {course.teacherBio ? (
                <p className="mt-3 text-lg leading-relaxed text-ink-muted">{course.teacherBio}</p>
              ) : null}
            </div>
          </div>
        </div>
      ),
    },
    ...(course.resources.length > 0
      ? [{ id: "resources" as const, label: "Resources", content: <ResourceList resources={course.resources} /> }]
      : []),
  ];

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        eyebrow={category?.title ?? "Course"}
        body={
          <>
            <h1 className="mt-5 max-w-3xl text-display">{course.title}</h1>
            <p className="mt-4 text-base font-semibold text-emerald-deep">
              {course.scriptureRange} · {course.teacher}
            </p>
            <p className="mt-4 max-w-2xl text-lead text-ink-muted">{course.summary}</p>
          </>
        }
        meta={
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <CourseStats course={{ ...course, sections: course.sectionCount }} className="text-base" />
              <CourseTags tags={course.tags} />
            </div>
            <CourseProgressBar course={course.slug} lessons={course.lessonSlugs} />
          </div>
        }
        actions={
          <CourseActions
            course={course.slug}
            title={course.title}
            lessons={course.lessonSlugs}
            hasTrailer={course.trailerVideoId !== undefined}
          />
        }
        visual={<ImageSlot id={course.image} sizes="(min-width: 1024px) 40vw, 100vw" />}
      />

      <div className="bg-surface">
        <div className={bandClass}>
          <Tabs label="Course" tabs={tabs} defaultTab="sections" />
        </div>
      </div>

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

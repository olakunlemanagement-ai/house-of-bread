import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { Tabs, type TabDef } from "@/components/academy/Tabs";
import { ButtonLabel, ButtonLink, buttonClasses } from "@/components/shared/Button";
import { MdxBody } from "@/components/shared/MdxBody";
import { ThemeToggle } from "@/components/shared/theme/ThemeToggle";
import { courseCatalog } from "@/lib/academy";
import { formatDuration, lessonNeighbours } from "@/lib/academy/navigation";
import { academyCopy } from "@/lib/content/copy";
import { siteConfig } from "@/lib/site-config";
import { LessonList } from "./_components/LessonList";
import { LessonListDialog } from "./_components/LessonListDialog";
import { LessonOptions } from "./_components/LessonOptions";
import { LessonVideo } from "./_components/LessonVideo";

// Render the full page before responding, so an unknown lesson returns a real 404.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const courses = await courseCatalog.listCourses();
  return courses.flatMap((course) => course.lessonSlugs.map((lesson) => ({ course: course.slug, lesson })));
}

export async function generateMetadata({ params }: PageProps<"/academy/[course]/[lesson]">): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const [course, lesson] = await Promise.all([
    courseCatalog.getCourse(courseSlug),
    courseCatalog.getLesson(courseSlug, lessonSlug),
  ]);
  if (!course || !lesson) return {};
  return { title: `Lesson ${lesson.number}, ${lesson.title}: ${course.title}`, description: lesson.description };
}

/**
 * One lesson, in the shape of BibleProject's session player, in a focused
 * layout: a slim lesson bar (Back to course; the centred "Lesson N · Title",
 * which opens every lesson; Options and the theme switch), the video behind
 * its click to load facade (or "This lesson is being prepared"), the
 * lesson's title, tabs for Notes, Transcript and Reflection (each hidden
 * when empty), then Previous lesson and Next lesson, or Finish course on
 * the last. A plain page, not a full screen hero: the video opens it, as on
 * a Teachings watch page.
 */
export default async function LessonPage({ params }: PageProps<"/academy/[course]/[lesson]">) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const [course, lesson] = await Promise.all([
    courseCatalog.getCourse(courseSlug),
    courseCatalog.getLesson(courseSlug, lessonSlug),
  ]);
  if (!course || !lesson) notFound();

  const courseHref = `/academy/${course.slug}` as Route;
  const lessonHref = (slug: string) => `/academy/${course.slug}/${slug}` as Route;
  const { previous, next } = lessonNeighbours(course.lessonSlugs, lesson.slug);
  const section = course.sections.find((item) => item.number === lesson.section);
  const preview = siteConfig.academy.status === "preview";
  const label = `Lesson ${lesson.number} · ${lesson.title}`;

  const tabs: TabDef[] = [
    ...(lesson.notes
      ? [{ id: "notes" as const, label: "Notes", content: <MdxBody source={lesson.notes} /> }]
      : []),
    ...(lesson.transcript
      ? [
          {
            id: "transcript" as const,
            label: "Transcript",
            content: (
              <div className="max-w-[68ch] space-y-4 text-lg leading-relaxed text-ink">
                {lesson.transcript.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...(lesson.reflection
      ? [
          {
            id: "reflection" as const,
            label: "Reflection",
            content: (
              <div className="max-w-[68ch]">
                <p className="font-serif text-2xl leading-snug text-ink">{lesson.reflection.question}</p>
                <p className="mt-3 text-base text-ink-muted">Take a moment with the question before you read the response.</p>
                <details className="group mt-6">
                  <summary className={`${buttonClasses("secondary", "light", "list-none [&::-webkit-details-marker]:hidden")} cursor-pointer`}>
                    <ButtonLabel>
                      <span className="group-open:hidden">Reveal response</span>
                      <span className="hidden group-open:inline">Hide response</span>
                    </ButtonLabel>
                  </summary>
                  <div className="mt-6 rounded-card border border-border bg-surface-warm p-6">
                    <p className="eyebrow">The teacher&apos;s response</p>
                    <p className="mt-3 text-lg leading-relaxed text-ink">{lesson.reflection.response}</p>
                  </div>
                </details>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <header className="border-b border-border bg-surface">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-fill-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <div className="mx-auto grid w-full max-w-[75rem] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-2 sm:px-6 lg:grid-cols-[1fr_minmax(0,2fr)_1fr]">
          <div className="justify-self-start">
            <ButtonLink href={courseHref} variant="secondary" size="sm">
              Back to course
            </ButtonLink>
          </div>
          <div className="col-span-2 row-start-2 flex min-w-0 justify-center lg:col-span-1 lg:row-start-1 lg:col-start-2">
            <LessonListDialog label={label} courseHref={courseHref} heading={course.title}>
              <LessonList course={course.slug} sections={course.sections} current={lesson.slug} />
            </LessonListDialog>
          </div>
          <div className="flex items-center justify-self-end gap-2 lg:col-start-3">
            <LessonOptions course={course.slug} lesson={lesson.slug} title={`${lesson.title}: ${course.title}`} notesFile={lesson.notesFile} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="bg-surface">
        <div className="container-page pb-10 pt-6 md:pb-16 md:pt-8">
          <div className="mx-auto max-w-5xl">
            {lesson.videoId ? (
              <LessonVideo course={course.slug} lesson={lesson.slug} videoId={lesson.videoId} title={label} />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-5 rounded-card border border-border bg-surface-mint p-6 text-center">
                <p className="max-w-md font-serif text-2xl leading-snug text-ink sm:text-3xl">This lesson is being prepared.</p>
                {preview ? (
                  <ButtonLink href={academyCopy.waitlistHref} variant="secondary" size="sm">
                    {academyCopy.waitlistLabel}
                  </ButtonLink>
                ) : null}
              </div>
            )}

            <div className="mt-6 md:mt-8">
              <p className="text-sm font-semibold text-emerald-deep">
                {section ? `Section ${section.number} · ${section.title}` : course.title}
              </p>
              <h1 className="mt-2 text-h2">{lesson.title}</h1>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">{lesson.description}</p>
              <p className="mt-2 text-sm text-ink">
                Lesson {lesson.number} of {course.lessons} · {formatDuration(lesson.minutes)}
              </p>
            </div>

            {tabs.length > 0 ? (
              <div className="mt-8 md:mt-10">
                <Tabs label="Lesson" tabs={tabs} defaultTab="notes" />
              </div>
            ) : null}

            <nav aria-label="Lessons" className="mt-10 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-14">
              {previous ? (
                <ButtonLink href={lessonHref(previous)} variant="secondary" className="w-full sm:w-auto">
                  Previous lesson
                </ButtonLink>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <ButtonLink href={lessonHref(next)} className="w-full sm:w-auto">
                  Next lesson
                </ButtonLink>
              ) : (
                <ButtonLink href={courseHref} className="w-full sm:w-auto">
                  Finish course
                </ButtonLink>
              )}
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}

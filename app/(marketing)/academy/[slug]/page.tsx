import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/Button";
import { IconTile, type IconName } from "@/components/shared/icons";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { SectionHeader } from "@/components/shared/Section";
import { MdxBody } from "@/components/shared/MdxBody";
import { courseCatalog } from "@/lib/academy";
import { academyCopy } from "@/lib/content/copy";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const courses = await courseCatalog.listCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/academy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseCatalog.getCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.summary };
}

type DetailId = "covers" | "who" | "when" | "join" | "cost";

const details: { id: DetailId; title: string; icon: IconName }[] = [
  { id: "covers", title: "What it covers", icon: "book" },
  { id: "who", title: "Who it is for", icon: "people" },
  { id: "when", title: "When it runs", icon: "calendar" },
  { id: "join", title: "How to join", icon: "arrow-right" },
  { id: "cost", title: "Cost", icon: "compass" },
];

export default async function CoursePage({ params }: PageProps<"/academy/[slug]">) {
  const { slug } = await params;
  const course = await courseCatalog.getCourse(slug);
  if (!course) notFound();
  const open = course.status === "open" && course.joinUrl;
  const detail: Record<DetailId, ReactNode> = {
    covers: <MdxBody source={course.overview} />,
    who: course.audience,
    when: course.schedule,
    join: open ? (
      <ButtonLink href={course.joinUrl as `https://${string}`}>
        Join this course
      </ButtonLink>
    ) : undefined,
    cost: course.cost,
  };

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        eyebrow="House of Bread Academy"
        title={course.title}
        lead={course.summary}
        meta={course.status === "coming-soon" ? <PlaceholderBadge label="Coming soon" /> : null}
        actions={
          open ? (
            <ButtonLink href="#join">
              See how to join
            </ButtonLink>
          ) : (
            <ButtonLink href={academyCopy.waitlistHref}>
              {academyCopy.waitlistLabel}
            </ButtonLink>
          )
        }
      />

      <div className="bg-surface">
        <div className="container-page grid gap-5 py-18 md:grid-cols-2 md:py-28">
          {details.map((item, index) => (
            <section
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-heading`}
              className={`rounded-card border border-border p-6 shadow-soft sm:p-8 ${
                index % 2 === 0 ? "bg-surface" : "bg-surface-mint"
              } ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-start gap-5">
                <IconTile name={item.icon} />
                <div className="flex-1">
                  <SectionHeader id={`${item.id}-heading`} size="compact">
                    {item.title}
                  </SectionHeader>
                  <div className="mt-6">
                    {detail[item.id] ?? <Placeholder block>[COURSE DETAILS TO BE SUPPLIED]</Placeholder>}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <NewsletterCard
        idPrefix="course-newsletter"
        heading={academyCopy.closingHeading}
        text={academyCopy.closingText}
        source="academy-waitlist"
      />
    </main>
  );
}

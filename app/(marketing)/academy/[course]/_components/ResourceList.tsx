import { ButtonLabel, buttonClasses } from "@/components/shared/Button";
import { IconTile } from "@/components/shared/icons";
import { Placeholder } from "@/components/shared/Placeholder";
import type { Resource } from "@/lib/academy";

/**
 * The Resources tab: each download as a row, with "Download" once the file
 * exists, or a marked placeholder until the ministry supplies it.
 */
export function ResourceList({ resources }: { resources: Resource[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {resources.map((resource) => (
        <li
          key={resource.title}
          className="flex flex-col gap-4 rounded-card border border-border bg-surface-raised p-4 sm:flex-row sm:items-center sm:p-5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <IconTile name="scroll" />
            <div className="min-w-0">
              <p className="text-lg font-semibold leading-snug text-ink">{resource.title}</p>
              <p className="text-sm text-ink-muted">{resource.kind}</p>
            </div>
          </div>
          {resource.file ? (
            // A plain anchor: a file download, not a page.
            <a href={resource.file} download className={buttonClasses("tertiary", "light", "w-full sm:w-auto", "sm")}>
              <ButtonLabel>
                Download<span className="sr-only">: {resource.title}</span>
              </ButtonLabel>
            </a>
          ) : (
            <Placeholder>[File to be supplied]</Placeholder>
          )}
        </li>
      ))}
    </ul>
  );
}

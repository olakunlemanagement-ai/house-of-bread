import type { Route } from "next";
import type { ReactNode } from "react";
import { ButtonLink } from "./Button";
import { IconTile, type IconName } from "./icons";

type EmptyStateProps = {
  icon: IconName;
  children: ReactNode;
  action?: { href: Route; label: string };
};

/** Icon, one line, one action. */
export function EmptyState({ icon, children, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-card border border-dashed border-border-strong bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
      <IconTile name={icon} size="lg" />
      <p className="max-w-xl flex-1 text-lg leading-relaxed text-ink">{children}</p>
      {action ? (
        <ButtonLink href={action.href} variant="secondary" className="w-full sm:w-auto">
          {action.label}
        </ButtonLink>
      ) : null}
    </div>
  );
}

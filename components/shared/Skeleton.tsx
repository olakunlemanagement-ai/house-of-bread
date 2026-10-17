import type { ReactNode } from "react";

/**
 * A neutral tint block with a gentle shimmer (transform only, still under
 * reduced motion). Decorative: wrap a group of them in LoadingRegion, which
 * carries aria-busy and the visually hidden label. Size each block like the
 * content it stands in for, so nothing shifts when the content arrives.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`skeleton block ${className}`} />;
}

/** The busy region around a set of skeletons, announced once as "Loading". */
export function LoadingRegion({
  children,
  label = "Loading",
  className = "",
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div aria-busy="true" className={className}>
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

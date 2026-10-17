import { LoadingRegion, Skeleton } from "@/components/shared/Skeleton";

// Shaped like a PageHeader and three cards, at their real sizes.
export default function Loading() {
  return (
    <main id="main">
      <LoadingRegion>
        <div className="bg-page-tint border-b border-border">
          <div className="container-page pb-16 pt-16 sm:pb-20 sm:pt-24">
            <Skeleton className="h-3 w-36 rounded-full" />
            <Skeleton className="mt-6 h-10 w-3/4 max-w-2xl rounded-xl sm:h-12" />
            <Skeleton className="mt-3 h-10 w-1/2 max-w-xl rounded-xl sm:h-12" />
            <Skeleton className="mt-6 h-4 w-full max-w-2xl rounded-full" />
            <Skeleton className="mt-3 h-4 w-2/3 max-w-lg rounded-full" />
          </div>
        </div>
        <div className="container-page grid gap-5 py-20 md:grid-cols-3 md:py-30">
          {[0, 1, 2].map((key) => (
            <div key={key} className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
              <Skeleton className="size-12 rounded-tile" />
              <Skeleton className="mt-6 h-6 w-2/3 rounded-full" />
              <Skeleton className="mt-4 h-4 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-5/6 rounded-full" />
            </div>
          ))}
        </div>
      </LoadingRegion>
    </main>
  );
}

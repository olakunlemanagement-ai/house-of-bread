// Skeleton shaped like a PageHeader and three cards. No spinner, no motion.
export default function Loading() {
  return (
    <main id="main" aria-busy="true">
      <p role="status" className="sr-only">
        Loading
      </p>
      <div aria-hidden="true">
        <div className="bg-green-hero">
          <div className="container-page pb-24 pt-14 sm:pb-32 sm:pt-20">
            <div className="h-3 w-32 rounded-full bg-on-green/30" />
            <div className="mt-6 h-12 w-3/4 max-w-2xl rounded-xl bg-on-green/20" />
            <div className="mt-3 h-12 w-1/2 max-w-xl rounded-xl bg-on-green/20" />
            <div className="mt-7 h-5 w-full max-w-2xl rounded-full bg-on-green/15" />
            <div className="mt-3 h-5 w-2/3 max-w-lg rounded-full bg-on-green/15" />
          </div>
        </div>
        <div className="container-page grid gap-5 py-18 md:grid-cols-3 md:py-28">
          {[0, 1, 2].map((key) => (
            <div key={key} className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
              <div className="size-12 rounded-tile bg-surface-mint" />
              <div className="mt-6 h-7 w-2/3 rounded-full bg-surface-mint" />
              <div className="mt-4 h-4 w-full rounded-full bg-surface-mint" />
              <div className="mt-2 h-4 w-5/6 rounded-full bg-surface-mint" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

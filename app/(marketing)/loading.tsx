// Skeleton shaped like a PageHeader and three cards. No spinner, no motion.
export default function Loading() {
  return (
    <main id="main" aria-busy="true">
      <p role="status" className="sr-only">
        Loading
      </p>
      <div aria-hidden="true">
        <div className="bg-green-band">
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
            <div className="h-4 w-32 rounded-full bg-lime/40" />
            <div className="mt-6 h-10 w-3/4 max-w-xl rounded-xl bg-on-green/20" />
            <div className="mt-6 h-5 w-full max-w-2xl rounded-full bg-on-green/15" />
            <div className="mt-3 h-5 w-2/3 max-w-lg rounded-full bg-on-green/15" />
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 md:py-24">
          {[0, 1, 2].map((key) => (
            <div key={key} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <div className="size-12 rounded-xl bg-surface-tint" />
              <div className="mt-5 h-6 w-2/3 rounded-full bg-surface-tint" />
              <div className="mt-4 h-4 w-full rounded-full bg-surface-tint" />
              <div className="mt-2 h-4 w-5/6 rounded-full bg-surface-tint" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

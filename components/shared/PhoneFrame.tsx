/**
 * A phone drawn in CSS with a simple mock of the app reading screen.
 * Illustrative only, not a screenshot. TODO: swap in real screenshots once
 * the app developer supplies them.
 */
export function PhoneFrame({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Illustration of the official app reading screen, showing John chapter 6 in the King James Version"
      className={`w-full max-w-[16rem] sm:max-w-[17rem] ${className}`}
    >
      <div className="rounded-[2.6rem] border-[10px] border-green-night bg-green-night shadow-[0_2px_6px_rgb(4_41_14/0.12),0_24px_48px_rgb(4_41_14/0.18)]">
        <div aria-hidden="true" className="overflow-hidden rounded-[1.9rem] bg-surface">
          <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-green-night/80" />
          <div className="bg-emerald mt-2 flex items-center justify-between px-5 pb-3 pt-3 text-on-green">
            <span className="font-serif text-sm font-semibold">John 6</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-bold text-emerald-deep">
              KJV
            </span>
          </div>
          <div className="space-y-3 px-5 py-5 font-serif text-[0.8rem] leading-relaxed text-ink">
            <p>
              <sup className="mr-1 font-sans font-bold text-emerald-deep">33</sup>
              For the bread of God is he which cometh down from heaven, and giveth life unto the world.
            </p>
            <p>
              <sup className="mr-1 font-sans font-bold text-emerald-deep">34</sup>
              Then said they unto him, Lord, evermore give us this bread.
            </p>
            <p className="rounded-lg bg-surface-mint p-2">
              <sup className="mr-1 font-sans font-bold text-emerald-deep">35</sup>
              And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger;
              and he that believeth on me shall never thirst.
            </p>
          </div>
          <div className="mx-5 mb-6 h-1.5 overflow-hidden rounded-full bg-surface-mint">
            <div className="h-full w-2/5 rounded-full bg-emerald" />
          </div>
        </div>
      </div>
    </div>
  );
}

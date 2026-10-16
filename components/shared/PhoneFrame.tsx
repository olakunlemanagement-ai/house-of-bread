/**
 * A phone drawn in CSS with a simple mock of the reading screen. No
 * screenshot needed. TODO: swap in real screenshots once supplied.
 */
export function PhoneFrame() {
  return (
    <div
      role="img"
      aria-label="Illustration of the app reading screen, showing John chapter 6 in the King James Version"
      className="mx-auto w-full max-w-[17rem]"
    >
      <div className="rounded-[2.5rem] border-[10px] border-green-night bg-green-night shadow-[0_24px_60px_rgb(1_31_11/0.45)]">
        <div aria-hidden="true" className="overflow-hidden rounded-[1.8rem] bg-surface">
          <div className="flex items-center justify-between bg-green-header px-5 pb-3 pt-5 text-on-green">
            <span className="text-sm font-bold">John 6</span>
            <span className="rounded-full bg-lime px-2 py-0.5 text-[0.65rem] font-bold text-on-lime">
              KJV
            </span>
          </div>
          <div className="space-y-3 px-5 py-5 font-serif text-[0.8rem] leading-relaxed text-ink">
            <p>
              <sup className="mr-1 font-sans font-bold text-green">33</sup>
              For the bread of God is he which cometh down from heaven, and giveth life unto the world.
            </p>
            <p>
              <sup className="mr-1 font-sans font-bold text-green">34</sup>
              Then said they unto him, Lord, evermore give us this bread.
            </p>
            <p className="rounded-lg bg-surface-tint p-2">
              <sup className="mr-1 font-sans font-bold text-green">35</sup>
              And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger;
              and he that believeth on me shall never thirst.
            </p>
          </div>
          <div className="mx-5 mb-5 h-1.5 overflow-hidden rounded-full bg-surface-tint">
            <div className="h-full w-2/5 rounded-full bg-success-on-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

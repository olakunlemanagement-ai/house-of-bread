import { useId } from "react";

export type FlagCode = "gb" | "ng" | "us";

// Hand drawn national flags as inline SVG, so they show on every system
// (Windows does not render flag emoji). Decorative: the country name always
// sits beside them as text. Sized by width, 24 to 40px; height follows the
// flag's own ratio. A faint outline keeps white edges visible on white.

const outline = "shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(11_36_18/0.15)]";

function UnitedKingdom({ className }: { className: string }) {
  const clip = useId();
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" focusable="false" className={className}>
      <clipPath id={clip}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${clip})`} stroke="#c8102e" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}

function Nigeria({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 6 3" aria-hidden="true" focusable="false" shapeRendering="crispEdges" className={className}>
      <rect width="6" height="3" fill="#ffffff" />
      <rect width="2" height="3" fill="#008751" />
      <rect x="4" width="2" height="3" fill="#008751" />
    </svg>
  );
}

// 19:10 with 13 stripes and a canton of 50 stars. At this size the stars
// read as a field of white points, which is what the eye expects.
const STRIPE = 10 / 13;
const CANTON_W = 7.6;
const CANTON_H = STRIPE * 7;
const stars: { x: number; y: number }[] = [];
for (let row = 0; row < 9; row++) {
  for (let col = row % 2 === 0 ? 0 : 1; col < 11; col += 2) {
    stars.push({ x: ((col + 1) * CANTON_W) / 12, y: ((row + 1) * CANTON_H) / 10 });
  }
}

function UnitedStates({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 19 10" aria-hidden="true" focusable="false" className={className}>
      <rect width="19" height="10" fill="#b22234" />
      <g fill="#ffffff" shapeRendering="crispEdges">
        {[1, 3, 5, 7, 9, 11].map((i) => (
          <rect key={i} y={i * STRIPE} width="19" height={STRIPE} />
        ))}
      </g>
      <rect width={CANTON_W} height={CANTON_H} fill="#3c3b6e" shapeRendering="crispEdges" />
      <g fill="#ffffff">
        {stars.map((star) => (
          <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r="0.2" />
        ))}
      </g>
    </svg>
  );
}

/** A national flag. Pass a width class (w-6 to w-10); the height follows. */
export function Flag({ code, className = "w-7" }: { code: FlagCode; className?: string }) {
  const classes = `${outline} h-auto ${className}`;
  if (code === "gb") return <UnitedKingdom className={classes} />;
  if (code === "ng") return <Nigeria className={classes} />;
  return <UnitedStates className={classes} />;
}

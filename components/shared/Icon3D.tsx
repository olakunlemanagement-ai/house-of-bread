import Image from "next/image";

/**
 * 3D icons from Microsoft Fluent Emoji (MIT, docs/CREDITS.md), built by
 * scripts/icons/build-icons.mjs as 160px WebP of a few KB each. Keep this
 * list in step with that script.
 */
export type Icon3DName =
  | "television"
  | "graduation-cap"
  | "scroll"
  | "mobile-phone"
  | "latin-cross"
  | "magnifying-glass"
  | "green-heart";

/**
 * A 3D icon on a still tint well (14px radius), which keeps the icon's own
 * colours contained against the green palette. Decorative: the card heading
 * says what it means. `.icon-3d` lets a card float it on hover and focus.
 */
export function Icon3D({ name, size = "md" }: { name: Icon3DName; size?: "md" | "lg" }) {
  const large = size === "lg";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-tile bg-tint ${
        large ? "size-20 sm:size-24" : "size-18 sm:size-20"
      }`}
    >
      <Image
        src={`/icons/3d/${name}.webp`}
        alt=""
        width={160}
        height={160}
        // Already sized and compressed at build, so served as is.
        unoptimized
        loading="lazy"
        className={`icon-3d ${large ? "size-14 sm:size-16" : "size-12 sm:size-14"}`}
      />
    </span>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Series } from "@/lib/youtube/catalog";
import { seriesHref, teachingCount } from "./format";

/**
 * Explore series: one large tile per series, its cover the first episode's
 * thumbnail, the name on a solid band of green-night at 85% (white text,
 * 10:1 or more over any image, as PlayChip; no gradient), and the number
 * of teachings in a pill. The whole tile is one link to the series page.
 */
export function SeriesGrid({ series }: { series: Series[] }) {
  return (
    <ul className={`grid gap-6 ${series.length > 1 ? "md:grid-cols-2" : "md:max-w-2xl"} ${series.length > 2 ? "lg:grid-cols-3" : ""}`}>
      {series.map((item) => {
        const cover = item.episodes[0]?.thumbnail;
        return (
          <li key={item.id}>
            <Link
              href={seriesHref(item.id)}
              className="group relative block aspect-video overflow-hidden rounded-card bg-tint ring-1 ring-border hover:ring-border-strong"
            >
              {cover ? (
                <Image
                  src={cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : null}
              <span className="absolute left-3 top-3 rounded-full bg-surface-raised px-3 py-1 text-sm font-semibold text-emerald-deep shadow-soft">
                {teachingCount(item)}
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-green-night/85 px-5 py-4 font-serif text-xl font-semibold leading-snug text-white">
                <span className="line-clamp-2">{item.title}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

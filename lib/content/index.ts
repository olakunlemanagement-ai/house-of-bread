import "server-only";
import { books } from "../scripture/index.ts";
import { formatErrors, loadLibrary, type Entry, type Library } from "./core.ts";
import type { ContentData, ContentType } from "./schemas.ts";

// Loaded once per process, synchronously. Pages stay fully static: no
// request data, no async work, nothing for the cache to revalidate.
let library: Library | undefined;

function getLibrary(): Library {
  // Reload on every call in development, so content edits show without a restart.
  if (library && process.env.NODE_ENV === "production") return library;
  const { library: loaded, errors } = loadLibrary(process.cwd());
  // An invalid file fails the build, with every problem listed.
  if (errors.length > 0) throw new Error(formatErrors(errors));
  library = sortLibrary(loaded);
  return library;
}

const bookOrder = new Map(books.map((book, index) => [book.id, index]));
const newestFirst = (a: Entry<"teaching">, b: Entry<"teaching">) => b.data.date.localeCompare(a.data.date);

function sortLibrary(loaded: Library): Library {
  return {
    teaching: [...loaded.teaching].sort(newestFirst),
    book: [...loaded.book].sort((a, b) => (bookOrder.get(a.data.slug) ?? 0) - (bookOrder.get(b.data.slug) ?? 0)),
    plan: [...loaded.plan].sort((a, b) => a.data.days - b.data.days),
    event: [...loaded.event],
    academyCategory: [...loaded.academyCategory].sort((a, b) => a.data.order - b.data.order),
    academyCourse: [...loaded.academyCourse].sort((a, b) => a.data.order - b.data.order),
    academyLesson: [...loaded.academyLesson].sort(
      (a, b) => a.data.course.localeCompare(b.data.course) || a.data.number - b.data.number,
    ),
    video: [...loaded.video],
  };
}

/** Frontmatter of every entry of a type, without bodies. Safe to pass to client components. */
export function getAll<T extends ContentType>(type: T): ContentData[T][] {
  return (getLibrary()[type] as Entry<T>[]).map((entry) => entry.data);
}

/** Every entry of a type with its body, in the library's order. Server only. */
export function getEntries<T extends ContentType>(type: T): Entry<T>[] {
  return getLibrary()[type] as Entry<T>[];
}

/** One entry with its body, or undefined. */
export function getEntry<T extends ContentType>(type: T, slug: string): Entry<T> | undefined {
  return (getLibrary()[type] as Entry<T>[]).find((entry) => entry.data.slug === slug);
}

export type { Entry } from "./core.ts";
export type * from "./schemas.ts";
export { upcomingEvents, type DatedEvent } from "./events.ts";

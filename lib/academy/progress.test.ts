import { describe, expect, it, vi } from "vitest";
import { completedIn, EMPTY_PROGRESS, LocalLessonProgress, parseStored, PROGRESS_KEY, serialise, type StorageEvents } from "./progress";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    data,
  };
}

const blocked = {
  getItem: () => {
    throw new DOMException("blocked", "SecurityError");
  },
  setItem: () => {
    throw new DOMException("full", "QuotaExceededError");
  },
};

describe("stored progress", () => {
  it("reads a well formed record", () => {
    expect(parseStored(serialise({ "a-course": ["one", "two"] }))).toEqual({ "a-course": ["one", "two"] });
  });

  it("treats anything malformed as nothing done", () => {
    for (const raw of [null, "", "not json", "[]", '{"v":2,"courses":{}}', '{"v":1}', '{"v":1,"courses":null}']) {
      expect(parseStored(raw)).toEqual(EMPTY_PROGRESS);
    }
  });

  it("drops entries that are not slugs and repeats", () => {
    const raw = JSON.stringify({ v: 1, courses: { "a-course": ["one", "one", 3, "<script>"], "Bad Course": ["one"], "b-course": "one" } });
    expect(parseStored(raw)).toEqual({ "a-course": ["one"] });
  });
});

describe("LocalLessonProgress", () => {
  it("marks and unmarks lessons, saving each change", () => {
    const storage = memoryStorage();
    const store = new LocalLessonProgress(() => storage);
    store.setCompleted("a-course", "one", true);
    store.setCompleted("a-course", "two", true);
    expect(completedIn(store.snapshot(), "a-course")).toEqual(new Set(["one", "two"]));
    store.setCompleted("a-course", "one", false);
    store.setCompleted("a-course", "two", false);
    expect(store.snapshot()).toEqual({});
    expect(storage.data.get(PROGRESS_KEY)).toBe(serialise({}));
  });

  it("reads what an earlier page view saved", () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: serialise({ "a-course": ["one"] }) });
    expect(new LocalLessonProgress(() => storage).snapshot()).toEqual({ "a-course": ["one"] });
  });

  it("keeps the same snapshot until something changes, and tells subscribers once per change", () => {
    const store = new LocalLessonProgress(() => memoryStorage());
    const first = store.snapshot();
    expect(store.snapshot()).toBe(first);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.setCompleted("a-course", "one", true);
    store.setCompleted("a-course", "one", true); // no change, no call
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.snapshot()).not.toBe(first);
    unsubscribe();
    store.setCompleted("a-course", "two", true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("works with storage blocked, keeping progress in memory", () => {
    const store = new LocalLessonProgress(() => blocked);
    expect(store.snapshot()).toEqual({});
    expect(() => store.setCompleted("a-course", "one", true)).not.toThrow();
    expect(completedIn(store.snapshot(), "a-course").has("one")).toBe(true);
  });

  it("works with no storage at all", () => {
    const store = new LocalLessonProgress(() => null);
    store.setCompleted("a-course", "one", true);
    expect(store.snapshot()).toEqual({ "a-course": ["one"] });
  });

  it("follows a change made in another tab", () => {
    let handler: ((event: { key: string | null; newValue: string | null }) => void) | undefined;
    const events: StorageEvents = {
      addEventListener: (_type, listener) => void (handler = listener),
      removeEventListener: () => void (handler = undefined),
    };
    const store = new LocalLessonProgress(() => memoryStorage(), events);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    handler?.({ key: "hob:theme", newValue: "dark" });
    expect(listener).not.toHaveBeenCalled();
    handler?.({ key: PROGRESS_KEY, newValue: serialise({ "a-course": ["two"] }) });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.snapshot()).toEqual({ "a-course": ["two"] });
    unsubscribe();
    expect(handler).toBeUndefined();
  });
});

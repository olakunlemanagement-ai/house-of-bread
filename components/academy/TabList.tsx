"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { parseTab, withTab } from "@/lib/academy/navigation";

type Tab = { id: string; label: string };

/** Event a "Watch the trailer" style button sends to open a tab: detail is the tab id. */
export const SELECT_TAB_EVENT = "academy:select-tab";

/** Opens a tab on this page, from anywhere (TabTrigger). */
export function selectTab(tab: string) {
  window.dispatchEvent(new CustomEvent<string>(SELECT_TAB_EVENT, { detail: tab }));
}

/**
 * The tablist for Tabs: WAI-ARIA tabs with automatic activation. Arrow keys
 * move between tabs, Home and End jump to the ends. Choosing a tab marks
 * the wrapper (data-tab, which CSS reads) and writes ?tab= with
 * replaceState, so the address can be shared and reload opens the same tab.
 * Its first render matches the server (the default tab); straight after,
 * it follows what the head of the wrapper already picked from the URL.
 */
export function TabList({ label, tabs, fallback }: { label: string; tabs: Tab[]; fallback: string }) {
  const [current, setCurrent] = useState(fallback);
  const list = useRef<HTMLDivElement>(null);

  function apply(id: string, focus = false) {
    const wrapper = list.current?.parentElement;
    if (!wrapper || !tabs.some((tab) => tab.id === id)) return;
    wrapper.setAttribute("data-tab", id);
    setCurrent(id);
    const search = withTab(window.location.search, id, fallback);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}${window.location.hash}`);
    if (focus) document.getElementById(`tab-${id}`)?.focus();
  }

  // Follow the tab named in the URL. On a full load the inline script has
  // already shown its panel; after a client side navigation it has not run,
  // so the wrapper is marked here too.
  useEffect(() => {
    const ids = tabs.map((tab) => tab.id);
    const picked = parseTab(window.location.search, ids, fallback);
    list.current?.parentElement?.setAttribute("data-tab", picked);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (picked !== fallback) setCurrent(picked);
    // Once, on mount: the tabs and fallback come from the server and do not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onSelect = (event: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === "string") apply(event.detail);
    };
    window.addEventListener(SELECT_TAB_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_TAB_EVENT, onSelect);
  });

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === current);
    const last = tabs.length - 1;
    const target =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1;
    if (target === -1) return;
    event.preventDefault();
    apply(tabs[target].id, true);
  }

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      data-js-only
      onKeyDown={onKeyDown}
      className="flex gap-1 overflow-x-auto border-b border-border"
    >
      {tabs.map((tab) => {
        const selected = tab.id === current;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => apply(tab.id)}
            className={`-mb-px min-h-12 shrink-0 border-b-2 px-4 text-[0.95rem] font-semibold outline-offset-[-3px] sm:px-5 ${
              selected ? "border-glyph text-emerald-deep" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

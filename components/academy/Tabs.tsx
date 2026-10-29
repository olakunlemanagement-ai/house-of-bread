import type { ReactNode } from "react";
import { TabList } from "./TabList";

/** Every tab id the pages use. Each needs its show rule in app/globals.css ("Academy tabs"). */
export const TAB_IDS = ["sections", "overview", "resources", "notes", "transcript", "reflection"] as const;
export type TabId = (typeof TAB_IDS)[number];

export type TabDef = { id: TabId; label: string; content: ReactNode };

/**
 * Tabs whose choice lives in the URL (?tab=overview), on a static page.
 * Every panel is in the first HTML. A short inline script picks the panel
 * named in the URL before the panels paint (data-tab on the wrapper, and
 * CSS shows that panel), so nothing shifts; the tablist (TabList) then
 * follows it and keeps the URL in step with replaceState. Without script
 * there is no tablist: every panel shows in order under its own heading.
 * Empty tabs are left out by the caller; with one tab left there is no
 * tablist at all.
 */
export function Tabs({ label, tabs, defaultTab }: { label: string; tabs: TabDef[]; defaultTab: TabId }) {
  if (tabs.length === 0) return null;
  const fallback = tabs.some((tab) => tab.id === defaultTab) ? defaultTab : tabs[0].id;
  const ids = tabs.map((tab) => tab.id);

  if (tabs.length === 1) {
    const [only] = tabs;
    return (
      <section aria-labelledby={`panel-${only.id}-heading`}>
        <h2 id={`panel-${only.id}-heading`} className="sr-only">
          {only.label}
        </h2>
        {only.content}
      </section>
    );
  }

  // Reads ?tab= and marks the wrapper before the panels below are parsed.
  const pick = `(function(s){var w=s.parentElement,t=new URLSearchParams(location.search).get("tab");if(${JSON.stringify(ids)}.indexOf(t)>-1)w.setAttribute("data-tab",t)})(document.currentScript)`;

  return (
    <div data-tabs data-tab={fallback}>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <TabList label={label} tabs={tabs.map(({ id, label: name }) => ({ id, label: name }))} fallback={fallback} />
      {tabs.map((tab) => (
        <section
          key={tab.id}
          id={`panel-${tab.id}`}
          data-panel={tab.id}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
          className="pt-8 outline-offset-4 md:pt-10"
        >
          {/* Shown without script, where there is no tablist to name the panel. */}
          <h2 data-panel-heading className="text-h2">
            {tab.label}
          </h2>
          {tab.content}
        </section>
      ))}
    </div>
  );
}

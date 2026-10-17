import type { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluateSync } from "@mdx-js/mdx";
import type { ScriptureVersion } from "@/lib/scripture";
import { Prose } from "./Prose";
import { ScriptureBlock } from "./ScriptureBlock";

type MdxScriptureProps = { passage: string; version: ScriptureVersion; children?: ReactNode };

// The only components content may use. The loader rejects any other.
const components = {
  Scripture: ({ passage, version, children }: MdxScriptureProps) => (
    <ScriptureBlock passage={passage} version={version}>
      {children}
    </ScriptureBlock>
  ),
};

/**
 * Renders an MDX body on the server at build time. The source comes from
 * /content and has already passed the loader's checks: no imports, no
 * unknown components, every passage parses. No JavaScript reaches the browser.
 */
export function MdxBody({ source }: { source: string }) {
  const { default: Content } = evaluateSync(source, { ...runtime, development: false });
  return <Prose>{Content({ components })}</Prose>;
}

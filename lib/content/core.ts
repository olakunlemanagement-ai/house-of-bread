// Content loader core: read /content, split frontmatter, validate it with Zod,
// and check the MDX body. Pure Node with relative imports, shared by the Next
// build (lib/content/index.ts) and `npm run content:validate`.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { compileSync } from "@mdx-js/mdx";
import { parseDocument } from "yaml";
import { parseReference, scriptureVersions } from "../scripture/index.ts";
import { academyErrors } from "./academy-checks.ts";
import { contentDirs, schemas, type ContentData, type ContentType } from "./schemas.ts";

export type ContentError = {
  /** Path relative to the project root, with forward slashes. */
  file: string;
  /** Frontmatter field, when the error is about one. */
  field?: string;
  /** Line in the file, when known. */
  line?: number;
  message: string;
};

export type Entry<T extends ContentType = ContentType> = {
  type: T;
  file: string;
  data: ContentData[T];
  /** MDX body without the frontmatter. */
  body: string;
};

export type ParseResult<T extends ContentType> =
  | { ok: true; entry: Entry<T> }
  | { ok: false; errors: ContentError[] };

/** Components a body may use. Anything else is an error, so a typo cannot reach a page. */
export const allowedComponents = ["Scripture"] as const;

/** CLAUDE.md section 6: no em dash, no en dash, no bullet symbol. */
const forbiddenCharacters: [string, string][] = [
  [String.fromCharCode(0x2014), "em dash"],
  [String.fromCharCode(0x2013), "en dash"],
  [String.fromCharCode(0x2022), "bullet"],
];

type BodyIssue = { line?: number; message: string };

type MdNode = {
  type: string;
  name?: string | null;
  attributes?: { type: string; name?: string; value?: unknown }[];
  children?: MdNode[];
  position?: { start: { line: number } };
};

function walk(node: MdNode, visit: (node: MdNode) => void) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

function attribute(node: MdNode, name: string): { present: boolean; value?: string; expression?: boolean } {
  const attr = node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  if (!attr) return { present: false };
  if (typeof attr.value === "string") return { present: true, value: attr.value };
  return { present: true, expression: true };
}

/** Remark plugin that records every body rule broken, without changing the tree. */
function bodyRules(issues: BodyIssue[]) {
  return () => (tree: MdNode) => {
    walk(tree, (node) => {
      const line = node.position?.start.line;
      if (node.type === "mdxjsEsm") {
        issues.push({ line, message: "import and export are not allowed in content, so it stays portable" });
      } else if (node.type === "blockquote") {
        issues.push({ line, message: 'quote scripture with <Scripture passage="..." version="KJV">, not a markdown blockquote' });
      } else if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        const name = node.name ?? "";
        if (!/^[A-Z]/.test(name)) return;
        if (!(allowedComponents as readonly string[]).includes(name)) {
          issues.push({ line, message: `<${name}> is not an allowed component (allowed: ${allowedComponents.join(", ")})` });
          return;
        }
        const passage = attribute(node, "passage");
        if (!passage.present) issues.push({ line, message: "<Scripture> needs a passage" });
        else if (passage.expression) issues.push({ line, message: '<Scripture passage> must be a plain string, for example passage="John 6:35"' });
        else {
          const parsed = parseReference(passage.value ?? "");
          if (!parsed.ok) issues.push({ line, message: `<Scripture passage="${passage.value}">: ${parsed.error}` });
        }
        const version = attribute(node, "version");
        if (!version.present) issues.push({ line, message: '<Scripture> needs a version, for example version="KJV"' });
        else if (!(scriptureVersions as readonly string[]).includes(version.value ?? "")) {
          issues.push({ line, message: `<Scripture version> must be one of ${scriptureVersions.join(", ")}` });
        }
      }
    });
  };
}

/** Compiles the body to catch MDX syntax errors and rule breaks. Lines are relative to the body. */
export function checkBody(body: string): BodyIssue[] {
  const issues: BodyIssue[] = [];
  try {
    compileSync(body, { remarkPlugins: [bodyRules(issues)] });
  } catch (error) {
    const line = typeof error === "object" && error !== null && "line" in error && typeof error.line === "number" ? error.line : undefined;
    const reason = typeof error === "object" && error !== null && "reason" in error ? String(error.reason) : String(error);
    issues.push({ line, message: `MDX does not compile: ${reason}` });
  }
  return issues;
}

/** Splits `---` frontmatter from the body. Returns the body's first line number too. */
export function splitFrontmatter(source: string): { yaml: string; body: string; bodyLine: number } | undefined {
  const text = source.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const match = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
  if (!match) return undefined;
  const bodyLine = match[0].split("\n").length - (match[0].endsWith("\n") ? 0 : 1);
  return { yaml: match[1], body: text.slice(match[0].length), bodyLine };
}

/** Parses and validates one file's text. `file` is used for messages and the slug check. */
export function parseEntry<T extends ContentType>(type: T, file: string, source: string): ParseResult<T> {
  const errors: ContentError[] = [];
  const split = splitFrontmatter(source);
  if (!split) {
    return { ok: false, errors: [{ file, line: 1, message: "must start with --- frontmatter --- " }] };
  }

  const doc = parseDocument(split.yaml);
  if (doc.errors.length > 0) {
    return {
      ok: false,
      errors: doc.errors.map((error) => ({
        file,
        line: error.linePos ? error.linePos[0].line + 1 : undefined,
        message: `frontmatter is not valid YAML: ${error.message.split("\n")[0]}`,
      })),
    };
  }
  const raw: unknown = doc.toJS();
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, errors: [{ file, message: "frontmatter must be a set of key: value fields" }] };
  }

  const result = schemas[type].safeParse(raw);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path.length > 0 ? issue.path.join(".") : undefined;
      const keys = issue.code === "unrecognized_keys" ? issue.keys.join(", ") : undefined;
      errors.push({
        file,
        field: keys ?? field,
        message: issue.code === "unrecognized_keys" ? "is not a field of this content type" : issue.message,
      });
    }
  } else {
    const expected = path.basename(file, ".mdx");
    if (result.data.slug !== expected) {
      errors.push({ file, field: "slug", message: `"${result.data.slug}" must match the file name "${expected}"` });
    }
  }

  source.split(/\r?\n/).forEach((text, index) => {
    for (const [char, name] of forbiddenCharacters) {
      if (text.includes(char)) {
        errors.push({ file, line: index + 1, message: `uses the ${name} character, use a comma, full stop or ellipsis instead (CLAUDE.md section 6)` });
      }
    }
  });

  for (const issue of checkBody(split.body)) {
    errors.push({ file, line: issue.line ? issue.line + split.bodyLine - 1 : undefined, message: issue.message });
  }

  if (errors.length > 0 || !result.success) return { ok: false, errors };
  return { ok: true, entry: { type, file, data: result.data as ContentData[T], body: split.body } };
}

export type Collection<T extends ContentType> = { entries: Entry<T>[]; errors: ContentError[] };

/**
 * Types whose files sit one folder deeper, in a folder per parent:
 * content/academy/lessons/<course>/<lesson>.mdx. The folder name must match
 * the entry's `course` field.
 */
const nestedTypes: Partial<Record<ContentType, "course">> = { academyLesson: "course" };

/** Loads every `.mdx` file of one type under `root/content`. A missing folder is an empty collection. */
export function loadCollection<T extends ContentType>(root: string, type: T): Collection<T> {
  const dir = path.join(root, "content", contentDirs[type]);
  if (!existsSync(dir)) return { entries: [], errors: [] };

  const entries: Entry<T>[] = [];
  const errors: ContentError[] = [];
  const parent = nestedTypes[type];

  const loadFile = (relative: string, folder?: string) => {
    const file = `content/${contentDirs[type]}/${relative}`;
    if (!relative.endsWith(".mdx")) {
      errors.push({ file, message: "only .mdx files belong in /content" });
      return;
    }
    const result = parseEntry(type, file, readFileSync(path.join(dir, relative), "utf8"));
    if (!result.ok) {
      errors.push(...result.errors);
      return;
    }
    if (parent && folder !== undefined) {
      const value = (result.entry.data as Record<string, unknown>)[parent];
      if (value !== folder) {
        errors.push({ file, field: parent, message: `"${String(value)}" must match the folder name "${folder}"` });
        return;
      }
    }
    entries.push(result.entry);
  };

  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue;
    if (!parent) {
      loadFile(name);
      continue;
    }
    const sub = path.join(dir, name);
    if (!statSync(sub).isDirectory()) {
      errors.push({ file: `content/${contentDirs[type]}/${name}`, message: `belongs in a folder named after its ${parent}` });
      continue;
    }
    for (const child of readdirSync(sub).sort()) {
      if (!child.startsWith(".")) loadFile(`${name}/${child}`, name);
    }
  }
  return { entries, errors };
}

export type Library = { [K in ContentType]: Entry<K>[] };

/** Loads every content type. Errors from all files are collected, not just the first. */
export function loadLibrary(root: string): { library: Library; errors: ContentError[] } {
  const errors: ContentError[] = [];
  const load = <T extends ContentType>(type: T) => {
    const collection = loadCollection(root, type);
    errors.push(...collection.errors);
    return collection.entries;
  };
  const library: Library = {
    teaching: load("teaching"),
    book: load("book"),
    plan: load("plan"),
    event: load("event"),
    academyCategory: load("academyCategory"),
    academyCourse: load("academyCourse"),
    academyLesson: load("academyLesson"),
    video: load("video"),
  };
  // Rules across files, checked only once every file parses on its own.
  if (errors.length === 0) errors.push(...academyErrors(library));
  return { library, errors };
}

/** One line per error: `content/events/x.mdx line 4: timeZone: message`. */
export function formatError(error: ContentError): string {
  const where = error.line ? `${error.file} line ${error.line}` : error.file;
  return error.field ? `${where}: ${error.field}: ${error.message}` : `${where}: ${error.message}`;
}

export function formatErrors(errors: ContentError[]): string {
  const count = `${errors.length} content error${errors.length === 1 ? "" : "s"}`;
  return [`${count}:`, ...errors.map((error) => `  - ${formatError(error)}`)].join("\n");
}

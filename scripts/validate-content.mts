// Validates every file in /content: frontmatter against its Zod schema,
// slugs against file names, and every scripture passage in frontmatter and
// body against /lib/scripture.
//
//   npm run content:validate
//
// Runs on Node's built-in type stripping (Node 22.18 or later), no extra
// tooling. Exits 1 and lists every error if any file fails.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatErrors, loadLibrary } from "../lib/content/core.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { library, errors } = loadLibrary(root);

if (errors.length > 0) {
  console.error(formatErrors(errors));
  process.exit(1);
}

const counts = Object.entries(library)
  .map(([type, entries]) => `${entries.length} ${type}`)
  .join(", ");
console.log(`Content valid: ${counts}.`);

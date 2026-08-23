import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TENZU_FILE_RE, UNIFIED_NAME } from "./unified-parse.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const unified = path.resolve(root, "..", UNIFIED_NAME);
if (!fs.existsSync(unified)) {
  throw new Error(`統合文書が見つからない: ${unified}`);
}

const text = fs.readFileSync(unified, "utf8");
const re = new RegExp(TENZU_FILE_RE.source, "g");
const blocks = [];
let match;
while ((match = re.exec(text))) {
  const block = match[0].replace(/^provenance:.*$/m, "provenance: 公開資料");
  blocks.push(block);
}

const out = path.join(root, "content", "tenzu-public.md");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${blocks.join("\n\n")}\n`, "utf8");
console.log(`extract ${blocks.length} files -> content/tenzu-public.md`);

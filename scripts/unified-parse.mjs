import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const UNIFIED_NAME = "日本裂島記_統合.md";

export const TENZU_FILE_RE =
  /<!--tenzu-file\s+([^\s>]+)\s*-->\r?\n([\s\S]*?)<!--\/tenzu-file-->/g;

export function resolveUnifiedPath(tenzuRoot) {
  const candidates = [
    process.env.TENZU_UNIFIED,
    path.resolve(tenzuRoot, "..", UNIFIED_NAME),
    path.resolve(tenzuRoot, "content", "tenzu-public.md"),
  ].filter(Boolean);
  for (const file of candidates) {
    if (fs.existsSync(file)) return file;
  }
  return path.resolve(tenzuRoot, "..", UNIFIED_NAME);
}

export function parseTenzuEntries(unifiedText) {
  const entries = [];
  const re = new RegExp(TENZU_FILE_RE.source, "g");
  let match;
  while ((match = re.exec(unifiedText))) {
    const rel = match[1].replaceAll("\\", "/");
    const raw = `${match[2].replace(/^\uFEFF/, "").replace(/\s+$/, "")}\n`;
    const parsed = matter(raw);
    const parts = rel.split("/");
    const collection = parts[0];
    const id = parts.slice(1).join("/").replace(/\.md$/, "");
    entries.push({
      collection,
      id,
      rel,
      data: parsed.data,
      body: parsed.content.replace(/^\r?\n/, ""),
      raw,
    });
  }
  return entries;
}

export function loadTenzuEntries(tenzuRoot) {
  const file = resolveUnifiedPath(tenzuRoot);
  const text = fs.readFileSync(file, "utf8");
  return parseTenzuEntries(text);
}

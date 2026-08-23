import { withBase } from "./paths";

export type DictIndexEntry = {
  slug: string;
  title: string;
  category: "person" | "org" | "place" | "event" | "misc";
};

const WIKI_PAIR = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
const WIKI_SOLO = /\[\[([^\]|]+)\]\]/g;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wikiHtml(entry: DictIndexEntry | undefined, slug: string, label: string): string {
  const text = escapeHtml(label);
  if (entry) {
    return `<a href="${withBase(`/dict/${entry.category}/${entry.slug}/`)}">${text}</a>`;
  }
  return `<span class="undefined-link" title="この項目はまだ執筆されていません">${text}</span>`;
}

export function replaceWiki(markdown: string, index: Map<string, DictIndexEntry>): string {
  const byPair = markdown.replace(WIKI_PAIR, (_m, slug: string, label: string) =>
    wikiHtml(index.get(slug), slug, label),
  );
  return byPair.replace(WIKI_SOLO, (_m, slug: string) => {
    const entry = index.get(slug);
    return wikiHtml(entry, slug, entry?.title ?? slug);
  });
}

export function extractWikiSlugs(markdown: string): string[] {
  const slugs = new Set<string>();
  for (const m of markdown.matchAll(WIKI_PAIR)) slugs.add(m[1]);
  for (const m of markdown.matchAll(WIKI_SOLO)) slugs.add(m[1]);
  return [...slugs];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function autolinkTitles(
  markdown: string,
  index: Map<string, DictIndexEntry>,
  currentSlug?: string,
): string {
  const entries = [...index.values()]
    .filter((entry) => entry.slug !== currentSlug)
    .sort((a, b) => b.title.length - a.title.length);

  return markdown
    .split("\n")
    .map((line) => {
      if (/^#{1,6}\s/.test(line)) return line;
      if (/^\s*!\[/.test(line)) return line;
      let out = line;
      for (const entry of entries) {
        const re = new RegExp(escapeRegExp(entry.title), "g");
        out = out.replace(re, (match, offset: number, whole: string) => {
          const before = whole.slice(0, offset);
          if (before.lastIndexOf("[[") > before.lastIndexOf("]]")) return match;
          if (before.lastIndexOf("[") > before.lastIndexOf("]")) return match;
          if (before.lastIndexOf("`") % 2 === 1) return match;
          return `[[${entry.slug}|${entry.title}]]`;
        });
      }
      return out;
    })
    .join("\n");
}

export function linkPlainText(
  text: string,
  index: Map<string, DictIndexEntry>,
  currentSlug?: string,
): string {
  const entries = [...index.values()]
    .filter((entry) => entry.slug !== currentSlug)
    .sort((a, b) => b.title.length - a.title.length);
  const taken = Array.from({ length: text.length }, () => false);
  const hits: { start: number; end: number; entry: DictIndexEntry }[] = [];

  for (const entry of entries) {
    if (!entry.title) continue;
    let from = 0;
    while (from < text.length) {
      const start = text.indexOf(entry.title, from);
      if (start < 0) break;
      const end = start + entry.title.length;
      if (!taken.slice(start, end).some(Boolean)) {
        hits.push({ start, end, entry });
        for (let i = start; i < end; i += 1) taken[i] = true;
      }
      from = start + 1;
    }
  }

  hits.sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const hit of hits) {
    out += escapeHtml(text.slice(cursor, hit.start));
    out += `<a href="${withBase(`/dict/${hit.entry.category}/${hit.entry.slug}/`)}">${escapeHtml(hit.entry.title)}</a>`;
    cursor = hit.end;
  }
  out += escapeHtml(text.slice(cursor));
  return out;
}

export function slugifyHeading(text: string): string {
  return text.trim().replace(/\s+/g, "-");
}

export function extractH2(markdown: string): { text: string; id: string }[] {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: slugifyHeading(m[1]),
  }));
}

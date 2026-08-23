import { getCollection, type CollectionEntry } from "astro:content";
import { BUILD_MODE } from "../site.config";
import { fileSlug, isPublishable } from "./publish";
import { compareIsoDesc, datePath } from "./dates";
import { withBase } from "./paths";
import { autolinkTitles, extractWikiSlugs, type DictIndexEntry } from "./wiki";

export async function publishedDict(): Promise<CollectionEntry<"dict">[]> {
  const all = await getCollection("dict");
  return all
    .filter((e) => isPublishable(e.data, BUILD_MODE))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "ja"));
}

export const NEWS_PER_PAGE = 20;

export async function publishedNews(): Promise<CollectionEntry<"news">[]> {
  const all = await getCollection("news");
  return all
    .filter((e) => isPublishable(e.data, BUILD_MODE))
    .sort((a, b) => compareIsoDesc(a.data.world_pub_date, b.data.world_pub_date));
}

export async function publishedCorp(): Promise<CollectionEntry<"corp">[]> {
  const all = await getCollection("corp");
  return all.filter((e) => isPublishable(e.data, BUILD_MODE));
}

export function dictEntrySlug(entry: CollectionEntry<"dict">): string {
  return fileSlug(entry.id);
}

export function newsEntrySlug(entry: CollectionEntry<"news">): string {
  return fileSlug(entry.id);
}

export function corpEntrySlug(entry: CollectionEntry<"corp">): string {
  return fileSlug(entry.id);
}

export function dictUrl(entry: CollectionEntry<"dict">): string {
  return withBase(`/dict/${entry.data.category}/${dictEntrySlug(entry)}/`);
}

export function newsUrl(entry: CollectionEntry<"news">): string {
  const { year, month, day } = datePath(entry.data.world_pub_date);
  return withBase(`/news/${year}/${month}/${day}/${newsEntrySlug(entry)}/`);
}

export function corpUrl(slug: string): string {
  return withBase(`/corp/${slug}/`);
}

export function dictIndexMap(entries: CollectionEntry<"dict">[]): Map<string, DictIndexEntry> {
  const map = new Map<string, DictIndexEntry>();
  for (const entry of entries) {
    const slug = dictEntrySlug(entry);
    map.set(slug, { slug, title: entry.data.title, category: entry.data.category });
  }
  return map;
}

export function relatedNews(
  news: CollectionEntry<"news">[],
  slug: string,
  limit = 5,
): CollectionEntry<"news">[] {
  return news.filter((n) => n.data.related_dict?.includes(slug)).slice(0, limit);
}

export function dictBacklinks(
  dict: CollectionEntry<"dict">[],
  slug: string,
): CollectionEntry<"dict">[] {
  const index = dictIndexMap(dict);
  return dict.filter((item) => {
    const other = dictEntrySlug(item);
    if (other === slug) return false;
    if (item.data.related?.includes(slug)) return true;
    const linked = autolinkTitles(item.body, index, other);
    return extractWikiSlugs(item.body).includes(slug) || extractWikiSlugs(linked).includes(slug);
  });
}

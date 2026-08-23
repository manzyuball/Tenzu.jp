import { marked, Renderer } from "marked";
import { withBase } from "./paths";
import { autolinkTitles, extractH2, replaceWiki, slugifyHeading, type DictIndexEntry } from "./wiki";

function prefixLocalAssets(html: string): string {
  return html.replace(/(src|href)="(\/(?:images)\/[^"]*)"/g, (_m, attr: string, path: string) => {
    return `${attr}="${withBase(path)}"`;
  });
}

const renderer = new Renderer();
renderer.heading = ({ text, depth }) => {
  const id = slugifyHeading(text);
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

marked.setOptions({
  gfm: true,
  breaks: false,
});
marked.use({ renderer });

export function renderMarkdown(
  markdown: string,
  index: Map<string, DictIndexEntry>,
  currentSlug?: string,
): string {
  const linked = autolinkTitles(markdown, index, currentSlug);
  const withWiki = replaceWiki(linked, index);
  const html = marked.parse(withWiki, { async: false }) as string;
  return prefixLocalAssets(html);
}

export function maybeToc(markdown: string): { text: string; id: string }[] {
  const h2 = extractH2(markdown);
  return h2.length >= 3 ? h2 : [];
}

export function plainExcerpt(markdown: string, max = 96): string {
  const text = markdown
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/記事・写真の無断転載を禁じます。/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

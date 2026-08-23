#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { loadTenzuEntries } from "./unified-parse.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CURRENT_WORLD_DATE = "2005-12-04";

const PAD_PHRASES = [
  "レジの列では",
  "取材の範囲は公開された発表",
  "同じ日の社会面は短い",
  "観察の単位は都市と日付",
  "包括的な統計、地番、死傷者",
  "・追記",
  "辞典では制度と経過の要約",
  "確認できない損害の数は書かない",
  "項目ごとに省略する",
  "続報を待つあいだも",
  "路地の水たまりは朝まで凍りそう",
  "二回目の汁でうどん",
  "灯油のポリタンクを提げる",
];

const FOOD_OK_RELS = new Set([
  "dict/misc/misoshiru.md",
  "dict/misc/nikujaga.md",
  "dict/misc/okonomiyaki.md",
  "dict/misc/udon.md",
  "dict/misc/yosenabe.md",
  "dict/misc/yudofu.md",
  "dict/misc/zoni.md",
  "news/2005/01/12/yosenabe-recipe.md",
  "news/2004/12/28/kuromon.md",
  "news/2004/12/31/toshikoshi.md",
  "news/2004/02/03/setsubun.md",
  "news/2005/06/20/kakei-senso.md",
  "news/2005/07/25/fukuoka-natsu.md",
  "news/2005/12/03/kyoto-shiwasu.md",
]);

const FOOD_LEAK = /うどん|寄せ鍋|丸餅|出汁|ポリタンク|路地の水たまり|ねぎを足|ねぎが束|秋刀魚|湯豆腐|うどん店|彼岸|菊の匂/;

const EDITORIAL_WORDS = [
  "本項",
  "本記事",
  "本項目は",
  "突合中",
  "欠落として",
  "欠落は欠落",
  "到達できた",
  "15日時点",
  "１５日時点",
  "創作はしない",
  "掲げない方針",
  "公開層",
];

const META_WORDS = [
  "東方",
  "Project",
  "キャラクター",
  "設定",
  "世界観",
  "本編",
  "作中",
  "元ネタ",
  "二次創作",
  "フィクション",
  "架空",
  "ストーリー",
  "シナリオ",
  "原作",
  "HOI4",
  "ゲーム",
  "動画",
  "実況",
  "視聴者",
  "プレイヤー",
  "資料集",
  "正史",
  "公式設定",
  "スポイラー",
  "ネタバレ",
  "2026年",
];

const META_WORD_BOUND = [/\bMod\b/];

/** 通年で公開本文に出してはいけない語 */
const NEVER_WORDS = [
  "むらさ",
  "鏑矢",
  "稗想天",
  "三種の神器",
  "監視航空船",
  "コールドスリープ",
  "日本国大統領",
  "第10代",
  "天網",
  "兵破",
  "ナポレオン作戦",
  "帝都決戦",
  "統一戦争",
  "停戦協定",
  "臨時政府",
  "八雲紫",
  "電子迷彩",
  "電子ステルス",
  "白和平",
];

/** 発生日以降のみ許可。ニュースは掲載日、辞典・会社案内はサイト基準日で判定する */
const GATED_WORDS = [
  { word: "ヤタガラス", from: "2005-02-06" },
  { word: "飛翔天測", from: "2005-04-17" },
  { word: "諏訪会談", from: "2005-03-20" },
  { word: "即位", from: "2005-07-15" },
  { word: "遷都", from: "2005-07-15" },
  { word: "戒厳令", from: "2005-11-01" },
  { word: "義勇軍", from: "2005-10-23" },
];

const FUTURE_BODY = /20(?:0[6-9]|[1-2]\d|30)年/;
const AFTER_CEASEFIRE = /2005年12月2[4-9]日|2005年12月3[01]日/;
const COPYRIGHT_RE = /©\s*\d{4}[^<\n]*/g;
const ALLOWED_COPYRIGHT = "© 2005 天通";

const args = new Set(process.argv.slice(2));
const SELFTEST = args.has("--selftest");
const HTML = args.has("--html");

function fail(message) {
  console.error(`CHECK FAIL: ${message}`);
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, acc);
    else if (name.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function isoFromUnknown(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value);
  const m = s.match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function publicText(data, body) {
  const parts = [data.title ?? "", body ?? "", data.notice ?? ""];
  if (Array.isArray(data.infobox)) {
    for (const row of data.infobox) {
      parts.push(row?.label ?? "", row?.value ?? "");
    }
  }
  if (Array.isArray(data.history)) {
    for (const row of data.history) {
      parts.push(row?.note ?? "");
    }
  }
  return parts.join("\n");
}

function findWords(text, words) {
  return words.filter((w) => text.includes(w));
}

function headingTitles(body) {
  return [...String(body ?? "").matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
}

function emptyHeadings(body) {
  const lines = String(body ?? "").split(/\r?\n/);
  const empty = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^## (.+)$/);
    if (!m) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j += 1;
    if (j >= lines.length || /^## /.test(lines[j])) empty.push(m[1].trim());
  }
  return empty;
}

function duplicateHeadings(body) {
  const counts = new Map();
  for (const title of headingTitles(body)) {
    counts.set(title, (counts.get(title) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n > 1).map(([title]) => title);
}

function nearDuplicateParas(body) {
  const paras = String(body ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("## ") && !p.includes("無断転載"));
  const hits = [];
  const norm = (s) => s.replace(/\s+/g, "");
  const similar = (a, b) => {
    const na = norm(a);
    const nb = norm(b);
    if (na.length < 24 || nb.length < 24) return na === nb;
    return na === nb || nb.includes(na.slice(0, 32)) || na.includes(nb.slice(0, 32));
  };
  for (let i = 0; i < paras.length; i++) {
    for (let j = i + 1; j < paras.length; j++) {
      if (similar(paras[i], paras[j])) hits.push(paras[i].slice(0, 24));
    }
  }
  return [...new Set(hits)];
}

function extractWikiSlugs(markdown) {
  const slugs = new Set();
  for (const m of markdown.matchAll(/\[\[([^\]|]+)\|([^\]]+)\]\]/g)) slugs.add(m[1]);
  for (const m of markdown.matchAll(/\[\[([^\]|]+)\]\]/g)) slugs.add(m[1]);
  return [...slugs];
}

function loadArticles(contentRoot) {
  if (contentRoot.endsWith(`${path.sep}content`) || contentRoot.endsWith("/content")) {
    const tenzuRoot = path.dirname(path.dirname(contentRoot));
    return loadTenzuEntries(tenzuRoot).map((entry) => ({
      file: entry.rel,
      id: path.posix.basename(entry.id),
      data: entry.data,
      body: entry.body,
    }));
  }
  const dictFiles = walk(path.join(contentRoot, "dict"));
  const newsFiles = walk(path.join(contentRoot, "news"));
  const corpFiles = walk(path.join(contentRoot, "corp"));
  const all = [...dictFiles, ...newsFiles, ...corpFiles].map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const id = path.basename(file, ".md");
    return { file, id, data: parsed.data, body: parsed.content };
  });
  return all;
}

function isDictPath(file) {
  const norm = String(file).replaceAll("\\", "/");
  return norm.includes("/dict/") || norm.startsWith("dict/");
}

function isNewsPath(file) {
  const norm = String(file).replaceAll("\\", "/");
  return norm.includes("/news/") || norm.startsWith("news/");
}

function gateDateFor(article) {
  if (isNewsPath(article.file)) {
    return isoFromUnknown(article.data.world_pub_date) || CURRENT_WORLD_DATE;
  }
  return CURRENT_WORLD_DATE;
}

function gatedHits(text, asOf) {
  return GATED_WORDS.filter((g) => text.includes(g.word) && asOf < g.from).map((g) => g.word);
}

function checkArticles(articles) {
  const errors = [];
  const dictIds = new Set();
  for (const a of articles) {
    if (isDictPath(a.file)) dictIds.add(a.id);
  }

  for (const article of articles) {
    const loc = path.isAbsolute(article.file) ? path.relative(ROOT, article.file) : article.file;
    const pub = isoFromUnknown(article.data.world_pub_date);
    const upd = isoFromUnknown(article.data.world_update_date);
    if (pub && pub > CURRENT_WORLD_DATE) {
      errors.push(`${loc}: world_pub_date ${pub} が基準日 ${CURRENT_WORLD_DATE} より後`);
    }
    if (upd && upd > CURRENT_WORLD_DATE) {
      errors.push(`${loc}: world_update_date ${upd} が基準日 ${CURRENT_WORLD_DATE} より後`);
    }

    const text = publicText(article.data, article.body);
    if (FUTURE_BODY.test(text)) {
      errors.push(`${loc}: 本文に基準日以後の年月表現`);
    }
    if (AFTER_CEASEFIRE.test(text)) {
      errors.push(`${loc}: 本文に停戦翌日以降の日付`);
    }

    const normLoc = loc.replaceAll("\\", "/");
    const isDictOrNews =
      normLoc.includes("/content/dict/") ||
      normLoc.includes("/content/news/") ||
      normLoc.startsWith("dict/") ||
      normLoc.startsWith("news/");
    if (isDictOrNews) {
      const bodyChars = String(article.body ?? "")
        .replace(/\s+/g, " ")
        .trim().length;
      if (bodyChars < 1000) {
        errors.push(`${loc}: 本文が${bodyChars}字で1000字未満`);
      }
      if (bodyChars > 10000) {
        errors.push(`${loc}: 本文が${bodyChars}字で10000字超`);
      }
      for (const heading of emptyHeadings(article.body)) {
        errors.push(`${loc}: 空の節「${heading}」`);
      }
      for (const heading of duplicateHeadings(article.body)) {
        errors.push(`${loc}: 重複する節「${heading}」`);
      }
      for (const snippet of nearDuplicateParas(article.body)) {
        errors.push(`${loc}: 重複する段落「${snippet}」`);
      }
    }

    const editorialHits = findWords(text, EDITORIAL_WORDS);
    if (editorialHits.length) errors.push(`${loc}: メタ記述 ${editorialHits.join("、")}`);
    const padHits = findWords(text, PAD_PHRASES);
    if (padHits.length) errors.push(`${loc}: 型文パディング ${padHits.join("、")}`);

    const rel = String(loc).replaceAll("\\", "/");
    const title = String(article.data.title ?? "");
    const foodTitle = /うどん|寄せ鍋|そば|黒門|乾麺|味噌汁|雑煮|お好み焼き|湯豆腐|肉じゃが/.test(
      title,
    );
    const leakHere =
      (isNewsPath(article.file) ||
        rel.startsWith("dict/person/") ||
        rel.startsWith("dict/org/") ||
        rel.startsWith("dict/event/")) &&
      !FOOD_OK_RELS.has(rel) &&
      !foodTitle;
    if (leakHere && FOOD_LEAK.test(String(article.body ?? ""))) {
      errors.push(`${loc}: 主題と無関係な食卓描写`);
    }

    const metaHits = findWords(text, META_WORDS);
    for (const re of META_WORD_BOUND) {
      if (re.test(text)) metaHits.push(re.source);
    }
    if (metaHits.length) errors.push(`${loc}: メタ語彙 ${metaHits.join("、")}`);

    const worldHits = findWords(text, NEVER_WORDS);
    if (worldHits.length) errors.push(`${loc}: 世界設定違反語 ${worldHits.join("、")}`);

    const earlyHits = gatedHits(text, gateDateFor(article));
    if (earlyHits.length) errors.push(`${loc}: 基準日前の事件語 ${earlyHits.join("、")}`);

    for (const m of text.matchAll(COPYRIGHT_RE)) {
      if (m[0].trim() !== ALLOWED_COPYRIGHT) {
        errors.push(`${loc}: 許可されないコピーライト「${m[0].trim()}」`);
      }
    }

    if (article.data.canon === "P") {
      errors.push(`${loc}: canon=P がコンテンツ配置に含まれている（_proposals 以外は不可）`);
    }

    const related = [
      ...(article.data.related ?? []),
      ...(article.data.related_dict ?? []),
      ...extractWikiSlugs(article.body),
    ];
    for (const slug of related) {
      if (!dictIds.has(slug)) {
        // unresolved is allowed (undefined-link). not an error.
      }
    }
  }
  return errors;
}

function checkHtml(distDir) {
  const errors = [];
  function walkHtml(dir) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, name.name);
      if (name.isDirectory()) walkHtml(p);
      else if (name.name.endsWith(".html")) {
        const html = fs.readFileSync(p, "utf8");
        const rel = path.relative(ROOT, p);
        const editorialHits = findWords(html, EDITORIAL_WORDS);
        if (editorialHits.length) errors.push(`${rel}: HTMLメタ記述 ${editorialHits.join("、")}`);
        const metaHits = findWords(html, META_WORDS);
        if (/\bMod\b/.test(html)) metaHits.push("Mod");
        if (metaHits.length) errors.push(`${rel}: HTMLメタ語彙 ${metaHits.join("、")}`);
        const worldHits = findWords(html, NEVER_WORDS);
        if (worldHits.length) errors.push(`${rel}: HTML世界設定違反語 ${worldHits.join("、")}`);
        const earlyHits = gatedHits(html, CURRENT_WORLD_DATE);
        if (earlyHits.length) errors.push(`${rel}: HTML基準日前の事件語 ${earlyHits.join("、")}`);
        if (html.includes("canon") && /canon["']?\s*[:=]\s*["']P["']/.test(html)) {
          errors.push(`${rel}: 公開HTMLに canon=P`);
        }
        for (const m of html.matchAll(COPYRIGHT_RE)) {
          if (m[0].trim() !== ALLOWED_COPYRIGHT) {
            errors.push(`${rel}: 許可されないコピーライト「${m[0].trim()}」`);
          }
        }
        if (html.includes("_proposals")) errors.push(`${rel}: _proposals が出力に含まれる`);
      }
    }
  }
  walkHtml(distDir);
  return errors;
}

function runSelftest() {
  const fixtures = path.join(__dirname, "fixtures");
  const cases = [
    { dir: "future", expect: /未来|基準日/ },
    { dir: "meta", expect: /メタ語彙/ },
    { dir: "canon", expect: /canon=P/ },
  ];
  let failed = 0;
  for (const c of cases) {
    const articles = loadArticles(path.join(fixtures, c.dir));
    const errors = checkArticles(articles);
    const joined = errors.join("\n");
    if (!errors.length || !c.expect.test(joined)) {
      console.error(`SELFTEST FAIL: ${c.dir} を検出できなかった`);
      console.error(joined || "(エラーなし)");
      failed += 1;
    } else {
      console.log(`SELFTEST OK: ${c.dir}`);
    }
  }
  if (failed) process.exit(1);
  console.log("SELFTEST OK: 3種の違反を検出");
}

if (SELFTEST) {
  runSelftest();
} else {
  const contentRoot = path.join(ROOT, "src", "content");
  const articles = loadArticles(contentRoot);
  const errors = checkArticles(articles);
  if (HTML) {
    errors.push(...checkHtml(path.join(ROOT, "dist")));
  }
  if (errors.length) {
    for (const e of errors) fail(e);
    process.exit(1);
  }
  console.log(`CHECK OK: ${articles.length} files`);
}

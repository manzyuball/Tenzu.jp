import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const failures = [];
const publicDate = '2026-05-06';

const htmlFiles = fs.readdirSync(root)
  .filter(name => name.endsWith('.html'))
  .map(name => ({ name, filePath: path.join(root, name) }));
const existing = new Set(htmlFiles.map(file => file.name));

const requiredRepresentativePages = [
  'index.html',
  'faction-tenzu.html',
  'faction-japan-tokyo-government.html',
  'character-hakurei-reimu.html',
];
const mainPageStandalone = [
  'assets/css/portal-home.css',
  'class="portal-bar"',
  'class="site-header"',
  'class="search-box"',
  'class="page-layout"',
  'class="left-column"',
  'class="main-column"',
  'class="right-column"',
  'class="mascot"',
  '急上昇ワード',
  '[PR]',
  '掲示板で話題の記事'
];
const utilityPages = new Set(['404.html']);

const requiredSections = [
  '概要',
  '批判・論争',
  '注釈',
  '出典',
  '関連項目',
  'カテゴリ',
];

const mojibakePattern = /(繝|縺|譁|螟|荳|蜈|髢|鬆|蟆|郢|邵|陜|闔|隴){3,}/;
const hrefPattern = /href="([^"#?]+?\.html)(?:[?#][^"]*)?"/g;
const forbidden = [
  'ログイン',
  '投稿フォーム',
  'データベース接続',
  '本編後',
  '作者',
  '設定資料集',
];

function fail(message) {
  failures.push(message);
}

for (const file of htmlFiles) {
  const bytes = fs.readFileSync(file.filePath);
  const text = bytes.toString('utf8');

  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    fail(`${file.name} has a UTF-8 BOM.`);
  }
  if (!text.startsWith('<!DOCTYPE html>')) {
    fail(`${file.name} is not standalone HTML.`);
  }
  if (!text.includes('<html lang="ja">')) {
    fail(`${file.name} is missing lang="ja".`);
  }
  if (mojibakePattern.test(text)) {
    fail(`${file.name} contains likely mojibake.`);
  }
  if (text.includes('href="#"')) {
    fail(`${file.name} contains placeholder href="#".`);
  }
  for (const match of text.matchAll(hrefPattern)) {
    const target = path.basename(match[1]);
    if (!existing.has(target)) {
      fail(`${file.name} links to missing page: ${match[1]}`);
    }
  }
  for (const term of forbidden) {
    if (text.includes(term)) {
      fail(`${file.name} contains forbidden or risky wording: ${term}`);
    }
  }
}

for (const name of requiredRepresentativePages) {
  if (!existing.has(name)) {
    fail(`${name} is missing.`);
    continue;
  }
  const text = fs.readFileSync(path.join(root, name), 'utf8');
  if (!text.includes(publicDate)) {
    fail(`${name} does not mention the public baseline date ${publicDate}.`);
  }
  const sectionsForPage = name === 'index.html'
    ? ['主要記事', '最近の更新', '編集室ログ', '公開資料メモ', '注釈', '出典', '関連項目', 'カテゴリ']
    : requiredSections;
  for (const section of sectionsForPage) {
    if (!text.includes(section)) {
      fail(`${name} is missing representative section/content: ${section}`);
    }
  }
  if (!text.includes('class="infobox"')) {
    fail(`${name} is missing an infobox.`);
  }
}

const searchIndexPath = path.join(root, 'assets', 'search-index.json');
try {
  const searchText = fs.readFileSync(searchIndexPath, 'utf8');
  if (mojibakePattern.test(searchText)) {
    fail('assets/search-index.json contains likely mojibake.');
  }
  const items = JSON.parse(searchText);
  const indexed = new Set();
  for (const item of items) {
    for (const key of ['title', 'url', 'summary', 'tags', 'article_type', 'nav_section', 'aliases', 'related']) {
      if (!Object.hasOwn(item, key)) {
        fail(`search index item ${item.title ?? '(unknown)'} is missing ${key}.`);
      }
    }
    if (item.url) {
      indexed.add(item.url);
      if (!existing.has(item.url)) {
        fail(`search index links to missing page: ${item.url}`);
      }
    }
  }
  for (const file of htmlFiles) {
    if (file.name !== '404.html' && file.name !== 'editor.html' && !indexed.has(file.name)) {
      fail(`${file.name} is missing from search index.`);
    }
  }
} catch (error) {
  fail(`assets/search-index.json is invalid: ${error.message}`);
}

for (const file of ['README.md', '_config.yml', 'scripts/generate-standalone-tenzu.mjs']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  if (mojibakePattern.test(text)) {
    fail(`${file} contains likely mojibake.`);
  }
}

if (failures.length) {
  console.error('Tenzu quality check failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('Tenzu quality check passed.');

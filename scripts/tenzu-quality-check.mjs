import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const failures = [];

const htmlFiles = fs.readdirSync(root)
  .filter(name => name.endsWith('.html'))
  .map(name => ({ name, filePath: path.join(root, name) }));

const existingNames = new Set(htmlFiles.map(file => file.name));
const forbiddenPatterns = [
  '紫機関',
  '西日本非常戒厳令',
  '七十二時間政変',
  '本編',
  '伏線',
  '後に重要',
  'やがて',
  '予感',
  '日本人民共和国',
  '南北日本戦記'
];
const mojibakePattern = /(繝|縺|譛|蜊|蝓|髢|螟|謾|隕|邨|荳|逕|譁|豁ｴ|莠){3,}/;
const hrefPattern = /href\s*=\s*"([^"#?]+?\.html)(?:[?#][^"]*)?"/g;
const baseStandalone = [
  '<style>'
];
const articleStandalone = [
  '<script>',
  'id="mw-head"',
  'id="mw-sidebar"',
  'id="mw-content"',
  'id="mw-right-aside"',
  'class="infobox"',
  'id="toc"',
  'カテゴリ:',
  'id="sec-出典"',
  'id="sec-関連項目"'
];
const mainPageStandalone = [
  'id="mw-head"',
  'id="mw-sidebar"',
  'id="mw-content"',
  'id="mw-right-aside"',
  'class="main-page"',
  'カテゴリ:'
];
const utilityPages = new Set(['404.html']);

function addFailure(message) {
  failures.push(message);
}

for (const file of htmlFiles) {
  const bytes = fs.readFileSync(file.filePath);
  const text = bytes.toString('utf8');

  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    addFailure(`${file.name} has a UTF-8 BOM.`);
  }
  if (/^\s*---\s*\r?\n/s.test(text)) {
    addFailure(`${file.name} still contains Jekyll front matter.`);
  }
  if (/(\{\{|\{%|%\}|\}\})/.test(text)) {
    addFailure(`${file.name} still contains Liquid syntax.`);
  }
  if (!/^\s*<!DOCTYPE html>\s*<html\s+lang="ja"/is.test(text)) {
    addFailure(`${file.name} is not a standalone Japanese HTML document.`);
  }
  const requiredElements = utilityPages.has(file.name)
    ? baseStandalone
    : file.name === 'index.html'
      ? [...baseStandalone, ...mainPageStandalone]
      : [...baseStandalone, ...articleStandalone];
  for (const required of requiredElements) {
    if (!text.includes(required)) {
      addFailure(`${file.name} is missing required standalone element: ${required}`);
    }
  }
  if (mojibakePattern.test(text)) {
    addFailure(`${file.name} contains likely mojibake text.`);
  }
  if (/(\{\{(?:Infobox|Main|Reflist)|\[\[[^\]]+\]\]|^==[^=].*==\s*$)/m.test(text)) {
    addFailure(`${file.name} contains unconverted MediaWiki syntax.`);
  }
  for (const pattern of forbiddenPatterns) {
    if (text.includes(pattern)) {
      addFailure(`${file.name} contains forbidden public-facing term or future reference: ${pattern}`);
    }
  }
  for (const match of text.matchAll(hrefPattern)) {
    const href = match[1];
    if (/^(https?:|mailto:|javascript:)/.test(href)) continue;
    const target = path.basename(href);
    if (!existingNames.has(target)) {
      addFailure(`${file.name} links to missing page: ${href}`);
    }
  }
}

const searchIndexPath = path.join(root, 'assets', 'search-index.json');
try {
  const searchText = fs.readFileSync(searchIndexPath, 'utf8');
  const searchIndex = JSON.parse(searchText);
  const indexedUrls = new Set();
  for (const item of searchIndex) {
    if (item.url) {
      indexedUrls.add(item.url);
      if (!existingNames.has(item.url)) {
        addFailure(`assets/search-index.json links to missing page: ${item.url}`);
      }
    }
    for (const key of ['title', 'url', 'summary', 'tags', 'article_type', 'nav_section', 'aliases', 'related']) {
      if (!Object.prototype.hasOwnProperty.call(item, key)) {
        addFailure(`assets/search-index.json item '${item.title}' is missing key: ${key}`);
      }
    }
  }
  for (const file of htmlFiles) {
    if (file.name !== '404.html' && !indexedUrls.has(file.name)) {
      addFailure(`${file.name} is missing from assets/search-index.json.`);
    }
  }
  for (const pattern of forbiddenPatterns) {
    if (searchText.includes(pattern)) {
      addFailure(`assets/search-index.json contains forbidden public-facing term or future reference: ${pattern}`);
    }
  }
  if (mojibakePattern.test(searchText)) {
    addFailure('assets/search-index.json contains likely mojibake text.');
  }
} catch (error) {
  addFailure(`assets/search-index.json is not valid JSON: ${error.message}`);
}

if (fs.existsSync(path.join(root, 'world-technology.html'))) {
  addFailure('world-technology.html should not remain as an independent public technology page.');
}

if (failures.length > 0) {
  console.error('Tenzu quality check failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('Tenzu quality check passed.');

# Tenzu記事生成プロンプト

この文書は、Tenzu.jpの記事を静的Jekyllページとして追加するための生成指示である。外部API、ログイン、投稿、ランキングなどの動的機能は使わない。

## 目的

Tenzu.jpは、情報複合体「天通」が2026年5月6日時点で公開している公刊辞典風の資料網である。記事はWikipedia風の体裁を取るが、実在百科事典の中立性をそのまま模倣するのではなく、報道、行政資料、企業広報、亡命者証言、推計が混在する資料として書く。

## 入力

- `title`: 記事名
- `article_type`: `state`, `corporation`, `media`, `character`, `event`, `technology`, `hub` のいずれか
- `nav_section`: `factions`, `characters`, `history` のいずれか
- `context`: 既存記事との関係、時期、勢力、重要語

## 出力形式

1つの `.html` ファイルとして出力する。先頭にJekyll front matterを置き、その後にHTML本文を続ける。

```yaml
---
layout: default
title: "記事名"
description: "検索結果とOG説明に使う120字以内の要約。"
nav_section: factions
article_type: media
status: Public Draft
updated_on: 2026-04-29
aliases:
  - 別名
related:
  - title: "関連項目"
    url: "/related.html"
    summary: "関係の短い説明。"
---
```

## 必須構造

- 冒頭にパンくずを置く。
- `<article class="mw-body">` と `<div class="mw-parser-output">` を使う。
- `h1.firstHeading` に記事名を置く。
- `meta` に基本ID、最終更新、公開状態を置く。
- 必要に応じて `hatnote.html`, `ambox.html`, `infobox.html` を使う。
- `_data/article_sections.yml` の `required` 見出しを本文に含める。
- 注釈と出典は `references.html` include に渡す。
- 関連項目は `related-links.html` include に渡す。

## 文体

- 第一文は百科事典風の定義文にする。
- 断定、推計、広報、批判、証言を混ぜる場合は、どの資料区分に由来するかを脚注で明示する。
- 2026年5月6日時点で公表・観測・記録されたことだけを書く。
- 本編開始後の出来事、未来から見た評価、未発生事件、制作上の説明を書かない。
- 「本作」「世界観」「設定」「物語」「入口ページ」「母艦記事」「読む順番」「カテゴリ」「現実の」など公開記事向きでない語を避ける。
- 心理描写を主軸にせず、会議、契約、報道、統計、運用記録を中心にする。
- 未確認情報は「とされる」「見方がある」「記録上は」などの距離を取る。

## 内部リンク

- 既存ページがある語は通常リンクにする。
- 未作成だが重要な語は `<a class="new" href="#">語</a>` として赤リンク風に残す。
- 同じ語へのリンクは近接範囲で過剰に繰り返さない。

## 出典区分

出典文には以下の区分を使う。

- `official`: 政府、監督庁、公的白書
- `tentsu`: 天通社史、天通辞典編集覚書、系列報道
- `diplomatic`: 外交記録、停戦協議、国外規制資料
- `trade`: 業界年鑑、物流・広告・通信市場資料
- `exile`: 亡命者、元関係者、内部告発
- `estimate`: 研究所、推計、外部分析

## 生成後チェック

- front matterがUTF-8 BOMなしで `---` から始まるか。
- `article_type` が `_data/article_sections.yml` に存在するか。
- 必須見出しが本文にあるか。
- 脚注IDが重複していないか。
- 内部リンク先が存在するか。
- `assets/search-index.json` に登録されているか。
- `scripts/tenzu-quality-check.ps1` が通るか。

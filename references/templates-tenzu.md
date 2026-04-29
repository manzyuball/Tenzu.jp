# Tenzu記事テンプレート定義

本書は Tenzu.jp の静的記事を追加・改稿するためのテンプレート集である。Tenzu.jpは、作中世界の情報複合体「天通」が運営する公刊辞典風資料網として扱う。

## 共通ルール

- 全記事はJekyll front matterから始める。
- `layout`, `title`, `description`, `nav_section`, `article_type`, `status`, `updated_on` を必須にする。
- `article_type` は `_data/article_sections.yml` に定義された種別を使う。
- 既存項目へのリンクは通常リンク、未作成の重要語は `a.new` を使う。
- 出典区分は `_data/reference_types.yml` の6分類に合わせる。
- 動的機能、外部DB、認証、閲覧ログ、投稿機能を前提にしない。

## 共通骨格

```html
---
layout: default
title: "記事名"
description: "120字以内の要約。"
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
external_links:
  - title: "資料名"
    url: "archive.html"
    summary: "資料の短い説明。"
---
{% capture infobox_rows %}
<tr><th class="infobox-header" colspan="2">概要</th></tr>
<tr><th class="infobox-label">名称</th><td class="infobox-data">記事名</td></tr>
{% endcapture %}
{% capture notes %}
<li id="cite_note-note1"><span class="mw-cite-backlink"><a href="#cite_ref-note1">↑</a></span><span class="reference-text">注釈本文。</span></li>
{% endcapture %}
{% capture sources %}
<li id="cite_note-1"><span class="mw-cite-backlink"><a href="#cite_ref-1">↑</a></span><span class="reference-text"><strong>{{ site.data.reference_types.official.label }}</strong>: 資料名。</span></li>
{% endcapture %}
<nav class="breadcrumbs" aria-label="パンくず"><a href="index.html">トップ</a> › 記事名</nav>
<article class="mw-body">
  <header>
    <h1 class="firstHeading">記事名</h1>
    <p class="meta">基本ID: file-name / 最終更新: {{ page.updated_on }} / 公開状態: {{ page.status }}</p>
  </header>
  <div class="mw-parser-output">
    {% include infobox.html caption=page.title rows=infobox_rows %}
    <p><b>記事名</b>は、...</p>
    <section><h2 id="概要"><span class="mw-headline">概要</span></h2></section>
    {% include references.html legend='本文に用いた出典区分は、' notes=notes sources=sources %}
    {% include related-links.html items=page.related external=page.external_links %}
  </div>
</article>
```

## 種別別テンプレート

### state

国家、政権、統治単位。必須見出しは「概要」「国号・呼称」「歴史」「統治・組織」「経済・社会」「対外関係」「批判・論争」。

第一文例:

`日本国（京都政権）は、分断後の日本国において国際承認と西日本統治を担う国家主体である。`

### corporation

財閥、工業会社、物流会社、金融会社。必須見出しは「概要」「呼称・位置づけ」「沿革」「組織・主要部門」「経済・社会的位置」「対外関係」「批判・論争」。

第一文例:

`山崎川城工業は、日本国において防衛、宇宙、半導体、AIを束ねる技術複合体である。`

### media

通信、報道、SNS、辞典運営など情報基盤。必須見出しは「概要」「呼称・ブランド」「沿革」「事業・情報基盤」「辞典運営と社会的役割」「対外関係」「批判・論争」。

第一文例:

`天通は、西日本の通信、報道、SNS、電子商取引、広告、辞典運営を束ねる情報複合体である。`

### character

人物。必須見出しは「概要」「経歴」「政治・軍事的位置」「関係人物」「評価」「影響」「批判・論争」。

第一文例:

`沙苗は、日本国（京都政権）において総理大臣を務め、72時間事件の中心人物となった政治家である。`

### event

事件、戦闘、政変、外交危機。必須見出しは「概要」「背景」「経過」「関係主体」「結果」「影響」「批判・論争」。

第一文例:

`72時間事件は、日本国（京都政権）の政治秩序と境界線運用を短期間で揺るがした政変である。`

### technology

通信網、AI、兵器、監視技術、産業基盤。必須見出しは「概要」「開発経緯」「構造・機能」「運用」「社会的影響」「批判・論争」。

第一文例:

`天網は、天通が運用する通信・本人確認・速報配信を束ねた情報基盤である。`

### place

地域、都市、施設、境界線上の拠点。必須見出しは「概要」「地理」「行政・管轄」「交通・補給」「戦略的位置」「社会・経済」。

第一文例:

`フォッサマグナ境界線は、分断後の日本国において南北勢力圏を隔てる地政学的境界である。`

### concept

用語、制度、思想、社会現象。必須見出しは「概要」「定義」「成立背景」「用法」「関連する制度・事件」「批判・論争」。

第一文例:

`従北は、京都政権下で北部政権への同調または協力を疑う政治ラベルとして用いられる語である。`

### archive

資料室、台帳、ログ、補助資料。必須見出しは「概要」「収録範囲」「資料区分」「利用上の注意」「関連項目」。

第一文例:

`外交記録簿は、分断日本をめぐる外交記録とTenzu.jp内の改稿履歴を対応させる資料である。`

## 編集チェックリスト

- `article_type` が `_data/article_sections.yml` に存在する。
- 必須見出しが本文に含まれる。
- 第一文で対象の種別、所属、時期、作中世界での位置づけが分かる。
- 脚注は注釈と出典を分ける。
- 出典文に資料区分ラベルを入れる。
- 関連項目が2件以上ある。
- `assets/search-index.json` に登録されている。
- `scripts/tenzu-quality-check.ps1` が通る。

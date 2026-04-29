# Tenzu.jp 設定Wiki

南北日本戦記の設定資料を管理する、GitHub Pages / Jekyll ベースの静的Wiki風サイトです。

## 構成方針

- 技術方式: GitHub Pages互換の Jekyll + HTML/CSS/JavaScript
- デザイン: Vector 2022風の静的Wiki UI
- 運用: 1ページ1ファイル。外部DB、ログイン、投稿、閲覧ログなどの動的機能は使わない
- 記事品質: front matter、出典区分、関連項目、検索インデックス、品質チェックを揃える

## 主要ファイル

- `index.html`: トップページ
- `*.html`: 各Wikiページ
- `_layouts/default.html`: 共通レイアウト
- `_includes/`: hatnote、ambox、infobox、脚注、関連項目などの部品
- `_data/article_sections.yml`: 記事種別ごとの必須見出しとinfobox項目
- `_data/reference_types.yml`: 出典区分
- `assets/css/wiki.css`: 共通スタイル
- `assets/app.js`: ナビゲーション、検索、ページ内目次
- `assets/search-index.json`: クライアント内検索インデックス
- `references/tenzu-generation-prompt.md`: Tenzu記事生成プロンプト
- `references/templates-tenzu.md`: 記事テンプレート定義
- `scripts/tenzu-quality-check.ps1`: 静的品質チェック

## 記事追加手順

1. `references/templates-tenzu.md` から対象種別のテンプレートを選ぶ。
2. `references/tenzu-generation-prompt.md` の方針に沿って本文を作る。
3. front matterに `layout`, `title`, `description`, `nav_section`, `article_type`, `status`, `updated_on` を入れる。
4. 必要なincludeを使い、infobox、注釈、出典、関連項目を整える。
5. `assets/search-index.json` に記事を追加する。
6. 品質チェックを実行する。

## 品質チェック

PowerShellで以下を実行します。

```powershell
powershell -ExecutionPolicy Bypass -File scripts/tenzu-quality-check.ps1
```

主なチェック項目:

- UTF-8 BOMなし
- front matterの存在
- 文字化けの疑い
- 未変換のMediaWiki記法
- 内部リンク切れ
- 検索インデックス漏れ
- `article_type` と `_data/article_sections.yml` の整合
- 脚注IDの重複

## 運用メモ

このサイトは静的ファイルだけで公開できる構成を維持します。サイバーセキュリティ上のリスクを増やす外部認証、投稿フォーム、管理API、データベース接続は、このリポジトリの通常運用には含めません。

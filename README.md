# Tenzu.jp

Tenzu.jp は、2026年5月6日時点の公開資料を整理する世界内百科です。公開版は静的HTMLだけで構成し、利用者認証、投稿受付、サーバー保存、外部管理APIは使いません。

## 運用方針

- 既存URLを維持する。
- 本文は公開資料として書き、作者視点の設定説明や未来の出来事を入れない。
- 代表記事は、定義、infobox、概要、沿革、構造、活動、関係、批判・論争、注釈、出典、関連項目、カテゴリを持つ。
- 掲示板感や編集参加感は、静的な編集室ログ、公開資料メモ、最近の更新として表現する。

## 生成

単体HTMLの正本は `scripts/generate-standalone-tenzu.mjs` です。通常は次を実行します。

```powershell
& "C:\\Users\\kaner\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe" scripts/generate-standalone-tenzu.mjs
```

## 品質確認

```powershell
powershell -ExecutionPolicy Bypass -File scripts/tenzu-quality-check.ps1
```

検査内容は、文字化け、内部リンク、検索索引、代表記事の必須節、未実装リンク、静的サイト方針の逸脱です。

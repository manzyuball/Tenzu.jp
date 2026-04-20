# Tenzu.jp 設定Wiki（GitHub Pages）

南北日本戦記の設定資料を管理する、静的HTMLベースのWiki風サイトです。

## 構成方針

- 技術方式: 素のHTML/CSS/JavaScript（ビルド不要）
- デザイン: シンプルWiki風（左ナビ・検索・パンくず・関連リンク）
- 運用: 1人編集（Write権限を持つユーザーのみ更新）
- 規模: 初期で約40ページ

## 主要ファイル

- `index.html` : トップ
- `*.html` : 各Wikiページ
- `assets/styles.css` : 共通スタイル
- `assets/app.js` : ナビ開閉・検索UI
- `assets/search-index.json` : クライアント検索インデックス
- `404.html` : 404ページ
- `.nojekyll` : PagesでJekyll無効化

## 命名規則

- 1ページ1ファイル
- 英数字スラッグ（kebab-case）で命名
  - 例: `faction-northern-alliance.html`
- カテゴリ入口は単語のみ
  - 例: `world.html`, `timeline.html`

## 追加方法（新規ページ）

1. 既存ページを複製して新しい `*.html` を作成
2. パンくず・メタ情報・関連項目を更新
3. 左ナビまたはカテゴリページからリンク追加
4. `assets/search-index.json` にタイトル・概要・URLを追記
5. 参照元ページへ相互リンクを追加

## 更新フロー

1. 下書き作成（1ファイル）
2. レビュー（リンク整合、表記統一）
3. `main` へ反映
4. GitHub Pages で公開確認

## GitHub Pages 公開手順

1. GitHub リポジトリの **Settings > Pages** を開く
2. Build and deployment の Source を **Deploy from a branch** に設定
3. Branch を `main`（または `gh-pages`）/ `/ (root)` に設定
4. 数分後に公開URLへアクセスして反映確認

## 独自ドメイン（任意）

- 無料で不要なら設定しなくて問題ありません。
- 利用する場合のみ `CNAME` ファイルを追加し、DNSを設定してください。

## 品質チェック（最低限）

- ページ追加時に手動でリンク遷移を確認
- 404ページ表示確認
- 検索で新規ページがヒットすることを確認

## バックアップ

- Git履歴がそのままバックアップになります。

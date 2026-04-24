# Tenzu.jp 設定Wiki（GitHub Pages / Jekyll）

南北日本戦記の設定資料を管理する、Jekyll ベースの静的Wiki風サイトです。

## 構成方針

- 技術方式: GitHub Pages 互換の Jekyll + HTML/CSS/JavaScript
- デザイン: シンプルWiki風（左ナビ・検索・パンくず・関連リンク）
- 運用: 1人編集（Write権限を持つユーザーのみ更新）
- 規模: 初期で約40ページ

## 主要ファイル

- `index.html` : トップ
- `*.html` : 各Wikiページ
- `_layouts/default.html` : 共通レイアウト
- `_includes/` : ハットノート、注意箱、情報ボックス、目次、脚注、関連項目などの再利用部品
- `_data/` : 出典種別や標準節構成などの共通データ
- `assets/css/wiki.css` : 共通スタイル
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

## 記事 front matter

長文記事では最低限、以下の front matter を使います。

- `title`
- `description`
- `nav_section`
- `article_type`
- `status`
- `updated_on`
- `aliases`
- `related`

## 追加方法（新規ページ）

1. 既存ページを複製して新しい `*.html` を作成
2. front matter を更新し、必要なら `_includes` を利用して構造を揃える
3. パンくず・メタ情報・関連項目を更新
4. 左ナビまたはカテゴリページからリンク追加
5. `assets/search-index.json` にタイトル・概要・URLを追記
6. 参照元ページへ相互リンクを追加

## 更新フロー（ブランチ運用）

実装対象ごとに独立したブランチを作り、PR単位で安全に取り込む運用を推奨します。

1. 実装対象ごとにブランチを作成
   - 例: `feat/skill-core`, `feat/ui-layout`, `feat/quality-gates`
2. 各ブランチで変更し、作業単位で `git add` / `git commit`
3. `git push origin <branch>` でリモートへ反映
4. ブランチごとにPRを作成（タイトル・概要・チェック項目を記載）
5. CIと表示確認が通ったPRから順にマージ
6. 最後にGitHub Pagesのデプロイ完了を確認

### PRテンプレート（推奨）

- **タイトル**: `feat: <変更点の要約>`
- **概要**: 何を、なぜ変更したか
- **チェック項目**:
  - [ ] ローカル表示確認
  - [ ] 主要リンク遷移確認
  - [ ] 検索インデックス更新（必要時）
  - [ ] CI通過
  - [ ] Pagesデプロイ確認

## GitHub Pages 公開手順

1. GitHub リポジトリの **Settings > Pages** を開く
2. Build and deployment の Source を **Deploy from a branch** に設定
3. Branch を `main`（または `gh-pages`）/ `/ (root)` に設定
4. 数分後に公開URLへアクセスして反映確認

## 独自ドメイン（任意）

- 無料で不要なら設定しなくて問題ありません。
- 利用する場合のみ `CNAME` ファイルを追加し、DNSを設定してください。

## 品質チェック（必須）

- ページ追加時に手動でリンク遷移を確認
- 404ページ表示確認
- 検索で新規ページがヒットすることを確認
- 生成時プリチェック（禁止語）: `scripts/tenzu-content-check.sh pre <対象ファイル>`
- 生成後ポストチェック（高リスク表現）: `scripts/tenzu-content-check.sh post <対象ファイル>`
- 詳細ルール: `references/compatibility-exclusions.md`

## バックアップ

- Git履歴がそのままバックアップになります。

# htmx-alpine-practice

HTMX、Alpine.js、Tailwind CSS を使用した練習プロジェクトです。

## プロジェクト内容

### 🔴 初代ポケモン図鑑アプリ

PokeAPI を使用した初代ポケモン（1-151 番）の図鑑アプリです。

**アクセス**: http://localhost:3000/pokedex.html

**機能**:

- ポケモン一覧表示（ページネーション対応）
- ポケモン詳細表示（ステータス、タイプ、説明文など）
- **日本語名・英語名対応検索機能**
  - 「ピカチュウ」「pikachu」どちらでも検索可能
  - 部分一致検索に対応
  - 初代ポケモン 151 匹の名前変換テーブル内蔵
- レスポンシブデザイン
- ダークモード切り替え

### 📚 ライブラリ練習ページ

HTMX、Alpine.js、Tailwind CSS の基本的な使用例です。

**アクセス**: http://localhost:3000/index.html

## セットアップ

1. 依存関係をインストール:

```bash
npm install
```

2. Tailwind CSS をビルド:

```bash
npm run build
```

3. 開発サーバーを起動:

```bash
npm start
```

これにより以下が起動します：

- HTTP サーバー (http://localhost:3000) - メインの Web ページ
- API サーバー (http://localhost:3001) - HTMX 用の API

## 個別実行

### Tailwind CSS 開発モード (ファイル変更を監視)

```bash
npm run dev
```

### HTTP サーバーのみ起動

```bash
npm run serve
```

### API サーバーのみ起動

```bash
npm run api
```

## 技術スタック

- **HTMX**: サーバーサイドレンダリングと AJAX リクエスト
- **Alpine.js**: 軽量な JavaScript フレームワーク
- **Tailwind CSS**: ユーティリティファーストの CSS フレームワーク
- **DaisyUI**: Tailwind CSS ベースの UI コンポーネントライブラリ
- **PokeAPI**: ポケモンデータの外部 API

## API エンドポイント

### ポケモン図鑑用 API

- `GET /api/pokemon?page=1` - ポケモン一覧取得（ページネーション）
- `GET /api/pokemon/{id}` - ポケモン詳細取得
- `GET /api/search?q={query}` - ポケモン名検索

### 練習用 API

- `GET /api/hello` - 基本的な HTMX テスト用

## ファイル構成

- `pokedex.html` - ポケモン図鑑メインページ
- `index.html` - ライブラリ練習ページ
- `src/input.css` - Tailwind CSS の入力ファイル
- `dist/output.css` - ビルドされた CSS ファイル
- `server.js` - API サーバー（PokeAPI プロキシ含む）
- `tailwind.config.js` - Tailwind CSS + DaisyUI 設定

## 使用している外部サービス

- **PokeAPI** (https://pokeapi.co/) - ポケモンの詳細データ
- **CDN**: HTMX, Alpine.js のライブラリ読み込み

# ToDo アプリ

React ベースの Next.js で作成されたSPA型ToDoアプリケーションです。

## 機能

- ✅ タスクの追加・編集・削除
- ✅ タスクの完了・未完了切り替え
- ✅ フィルタリング機能（全て・未完了・完了済み）
- ✅ ソート機能（作成順・完了順）
- ✅ 完了時刻の自動記録・表示
- ✅ データの永続化（localStorage）
- ✅ 削除確認モーダル
- ✅ インライン編集（クリック・ダブルクリック・編集ボタン）
- ✅ 日本語入力対応
- ✅ レスポンシブデザイン

## 技術スタック

- **Frontend**: Next.js 15.3.4, React 19.1.0
- **言語**: TypeScript 5.8.3
- **スタイリング**: CSS（グローバル）
- **デプロイ**: GitHub Pages
- **データ保存**: localStorage

## 開発環境

### 必要な環境
- Node.js 22.16.0

### セットアップ
```bash
npm install
npm run dev
```

### ビルド
```bash
npm run build
```

### デプロイ
```bash
npm run deploy
```

## ライブデモ

https://osamu38.github.io/vibe-coding/

## プロジェクト構造

```
├── app/
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # メインページ
├── components/
│   └── TodoApp.tsx          # ToDoアプリのメインコンポーネント
├── types/
│   └── todo.ts              # TypeScript型定義
└── .github/workflows/
    └── deploy.yml           # GitHub Pages自動デプロイ
```
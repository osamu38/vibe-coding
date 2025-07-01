# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

必ず日本語で回答してください。

## Project Overview

React ベースの Next.js で作成されたSPA型ToDoアプリケーションです。データはすべてブラウザのlocalStorageに保存され、永続化を実現しています。シングルユーザー想定でログイン機能はなく、静的サイトとしてエクスポート可能な構成になっています。

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production (static export to ./out)
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Architecture & Data Flow

### State Management
- 全ての状態管理は `components/TodoApp.tsx` 内の React Hooks（useState）で実行
- localStorage との同期は useEffect で自動化
- 複数の UI 状態を管理:
  - `editingId, editingText` - インライン編集機能
  - `deleteConfirmId` - 削除確認モーダル
  - `sortBy` - ソート順序（created/completed）
  - `filter` - フィルター状態（all/active/completed）

### Data Persistence & Todo Schema
- `localStorage.getItem('todos')` からの初期データ読み込み
- 状態変更時の自動保存（useEffect dependency: todos）
- Todo オブジェクト構造:
  - `createdAt: Date` - 作成時刻
  - `completedAt?: Date` - 完了時刻（完了時に自動記録）
- Date オブジェクトの JSON シリアライゼーション/デシリアライゼーション処理

### Component Structure
- **TodoApp**: メインコンポーネント（全機能を含む）
  - タスクの CRUD 操作
  - フィルタリング機能（all/active/completed）
  - ソート機能（作成順/完了順）
  - インライン編集機能（クリック、ダブルクリック、編集ボタン）
  - 削除確認モーダル
  - 完了時刻表示
- **Layout**: Next.js App Router のルートレイアウト
- **Page**: TodoApp をレンダリングするだけのシンプルなページ

### Styling Architecture
- CSS モジュールや CSS-in-JS は使用せず、グローバル CSS（`app/globals.css`）
- BEM 的な命名規則（`.todo-item`, `.todo-actions` など）
- レスポンシブデザインは基本的な CSS で実装

## Technical Configuration

### Next.js Configuration
- `output: 'export'` - 静的サイト生成用
- `distDir: 'out'` - ビルド出力ディレクトリ
- App Router を使用（pages router ではない）

### TypeScript Types
- `types/todo.ts` で Todo インターフェースと FilterType を定義
- 日付フィールド:
  - `createdAt: Date` - 必須、作成時刻
  - `completedAt?: Date` - オプショナル、完了時刻

## Key Implementation Notes

### Editing Functionality
- インライン編集は editingId state で制御
- 完了済みタスクは編集不可（UI レベルとロジックレベルの両方で制御）
- 編集開始: テキストクリック、ダブルクリック、編集ボタン
- onBlur イベントでの自動保存時に、ボタンクリック（保存・取消）との競合状態を回避
- Enter キー（保存）と Escape キー（キャンセル）のキーボードショートカット対応
- IME（日本語入力）の変換確定時は Enter キーを無視（`!e.nativeEvent.isComposing`）

### Modal & State Conflicts
- 削除確認モーダルと編集状態の競合を防ぐため、編集中は削除確認を無効化
- 各状態変更時に関連する他の状態をクリア（例: 編集開始時に deleteConfirmId をクリア）

### Completion Tracking
- タスク完了時に `completedAt` フィールドに現在時刻を自動記録
- 未完了に戻す時は `completedAt` を undefined にクリア
- 完了時刻は日本語ロケールで表示（yyyy/mm/dd hh:mm 形式）

### Sorting & Filtering
- フィルタリング後にソート処理を適用
- 作成順: `createdAt` の降順（新しい順）
- 完了順: `completedAt` または `createdAt` の降順（未完了タスクは作成時刻を使用）

### localStorage Integration
- コンポーネントマウント時の初期データ読み込み
- todos 配列が変更されるたびに自動保存
- Date オブジェクトの適切な復元処理（createdAt, completedAt 両方）

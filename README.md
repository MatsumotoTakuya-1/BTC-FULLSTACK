#　株価予測アプリ
このアプリは、指定した銘柄の過去データをもとに株価予測 を行い、チャート表示・履歴保存・モデル切替ができる Web アプリです。

```
BTC-FULLSTACK/
├── client/           # React フロントエンド
├── server/           # Node.js + Express バックエンドAPI
└── README.md
```

## 🖥 使用技術

- フロントエンド React
- バックエンド Node.js, Express, Knex.js, PostgreSQL
- その他 Yahoo Finance API

## 🚀 起動方法

```
1. PostgreSQL を起動（Render またはローカル）
.env に必要な接続情報を記述してください。

2. サーバとフロントエンド
bash-
コードをコピーする
cd server
npm install
npm run dev  # サーバ起動（localhost:4000）

cd ../client
npm install
npm run dev  # フロント起動（localhost:5173）

```

## 🔄 機能一覧

- 機能 説明
- 🔍 銘柄検索 株式シンボル（例: AAPL）でデータ取得
- 📊 チャート表示 実株価・予測値を表示
- 📁 履歴保存・呼出 過去の検索履歴を保持・クリックで復元

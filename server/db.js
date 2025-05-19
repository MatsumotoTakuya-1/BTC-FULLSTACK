// server/db.js
const knex = require("knex");
const config = require("./knexfile");

// 環境変数 NODE_ENV を見て設定を切り替える
const environment = process.env.NODE_ENV || "development";
const db = knex(config[environment]);

module.exports = db;

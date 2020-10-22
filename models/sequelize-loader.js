'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/schedule_arranger_demo'    // スキーム/ユーザー名:パスワード@アクセス先サーバー名:ポート番号/パス
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
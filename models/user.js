'use strict';
const loader = require('./sequelize-loader');    // loader モジュールをインポート
const Sequelize = loader.Sequelize;    // loader モジュールから Sequelize オブジェクトを取得

// データベースに user の情報を登録. Sequelize で扱えるようにする.（users で定義）
const User = loader.database.define(
  'users',
  {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,    // 定義したデータを保存する領域を users という名前で固定する機能
    timestamps: false
  }
);

module.exports = User;




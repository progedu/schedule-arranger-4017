'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Comment = loader.database.define(
  'comments',
  {
    scheduleId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false    // scheduleId はもちろん index の設定をしたほうがよいが、主キーは index に自動で設定されるため、別途作成の必要はない
  }
);

module.exports = Comment;
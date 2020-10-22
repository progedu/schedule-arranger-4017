'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

// データベース上に sequelize を定義
const Schedule = loader.database.define(
  'schedules',
  {
    scheduleId: {
      type: Sequelize.UUID,
      primaryLey: true,
      allowNull: false
    },
    scheduleName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    memo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  }
);

module.exports = Schedule;
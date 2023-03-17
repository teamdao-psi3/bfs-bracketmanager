const { DataTypes } = require('sequelize')
module.exports = (sequelize) => {
  return sequelize.define('tournament', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    participants: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    }
  },{
    tableName: 'tournaments',
  })
}
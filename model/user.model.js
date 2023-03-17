const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },{
    tableName: 'users',
  })
}
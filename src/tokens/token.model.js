const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    token: { type: DataTypes.STRING, allowNull: false },
    clave: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {};

  return sequelize.define("Token", attributes);
}

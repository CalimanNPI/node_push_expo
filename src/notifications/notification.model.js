const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    expiry: { type: DataTypes.DATE },
    type: { type: DataTypes.STRING },
  };


  /**
   *  Actualizacion 1,
   *  Recordatorio informativo 2
   *  Contenido 3
   *  Pagos 4
   *  
   */

  const options = {};

  return sequelize.define("Notification", attributes);
}

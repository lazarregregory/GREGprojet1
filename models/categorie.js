const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categorie', {
    idcategorie: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomcategorie: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'categorie',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idcategorie" },
        ]
      },
    ]
  });
};

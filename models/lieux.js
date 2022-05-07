const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lieux', {
    idLieux: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Titre: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Image: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idadmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'administrateurs',
        key: 'idadmin'
      }
    },
    idcategorie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categorie',
        key: 'idcategorie'
      }
    }
  }, {
    sequelize,
    tableName: 'lieux',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idLieux" },
          { name: "idadmin" },
          { name: "idcategorie" },
        ]
      },
      {
        name: "idcategorie",
        using: "BTREE",
        fields: [
          { name: "idcategorie" },
        ]
      },
      {
        name: "idadmin",
        using: "BTREE",
        fields: [
          { name: "idadmin" },
        ]
      },
    ]
  });
};

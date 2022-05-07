const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activites', {
    idactivites: {
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
    }
  }, {
    sequelize,
    tableName: 'activites',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idactivites" },
          { name: "idadmin" },
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

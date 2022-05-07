const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commentaires', {
    idcom: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    commentaire: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    idLieux: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'lieux',
        key: 'idLieux'
      }
    },
    idactivites: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'activites',
        key: 'idactivites'
      }
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'commentaires',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idcom" },
          { name: "idLieux" },
          { name: "idactivites" },
        ]
      },
      {
        name: "idLieux",
        using: "BTREE",
        fields: [
          { name: "idLieux" },
        ]
      },
      {
        name: "idactivites",
        using: "BTREE",
        fields: [
          { name: "idactivites" },
        ]
      },
    ]
  });
};

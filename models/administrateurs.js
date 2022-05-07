const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrateurs', {
    idadmin: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nom: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Prenom: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    mdp: {
      type: DataTypes.STRING(100000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'administrateurs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idadmin" },
        ]
      },
    ]
  });
};

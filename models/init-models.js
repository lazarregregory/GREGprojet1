var DataTypes = require("sequelize").DataTypes;
var _activites = require("./activites");
var _administrateurs = require("./administrateurs");
var _categorie = require("./categorie");
var _commentaires = require("./commentaires");
var _lieux = require("./lieux");

function initModels(sequelize) {
  var activites = _activites(sequelize, DataTypes);
  var administrateurs = _administrateurs(sequelize, DataTypes);
  var categorie = _categorie(sequelize, DataTypes);
  var commentaires = _commentaires(sequelize, DataTypes);
  var lieux = _lieux(sequelize, DataTypes);

  activites.belongsToMany(lieux, { as: 'idLieux_lieuxes', through: commentaires, foreignKey: "idactivites", otherKey: "idLieux" });
  administrateurs.belongsToMany(categorie, { as: 'idcategorie_categories', through: lieux, foreignKey: "idadmin", otherKey: "idcategorie" });
  categorie.belongsToMany(administrateurs, { as: 'idadmin_administrateurs', through: lieux, foreignKey: "idcategorie", otherKey: "idadmin" });
  lieux.belongsToMany(activites, { as: 'idactivites_activites', through: commentaires, foreignKey: "idLieux", otherKey: "idactivites" });
  commentaires.belongsTo(activites, { as: "idactivites_activite", foreignKey: "idactivites"});
  activites.hasMany(commentaires, { as: "commentaires", foreignKey: "idactivites"});
  activites.belongsTo(administrateurs, { as: "idadmin_administrateur", foreignKey: "idadmin"});
  administrateurs.hasMany(activites, { as: "activites", foreignKey: "idadmin"});
  lieux.belongsTo(administrateurs, { as: "idadmin_administrateur", foreignKey: "idadmin"});
  administrateurs.hasMany(lieux, { as: "lieuxes", foreignKey: "idadmin"});
  lieux.belongsTo(categorie, { as: "idcategorie_categorie", foreignKey: "idcategorie"});
  categorie.hasMany(lieux, { as: "lieuxes", foreignKey: "idcategorie"});
  commentaires.belongsTo(lieux, { as: "idLieux_lieux", foreignKey: "idLieux"});
  lieux.hasMany(commentaires, { as: "commentaires", foreignKey: "idLieux"});

  return {
    activites,
    administrateurs,
    categorie,
    commentaires,
    lieux,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

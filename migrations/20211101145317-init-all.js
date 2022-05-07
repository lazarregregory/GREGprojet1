'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "administrateurs", deps: []
 * createTable "categorie", deps: []
 * createTable "activites", deps: [administrateurs]
 * createTable "lieux", deps: [administrateurs, categorie]
 * createTable "commentaires", deps: [lieux, activites]
 * addIndex "PRIMARY" to table "activites"
 * addIndex "idadmin" to table "activites"
 * addIndex "PRIMARY" to table "administrateurs"
 * addIndex "PRIMARY" to table "categorie"
 * addIndex "PRIMARY" to table "commentaires"
 * addIndex "idLieux" to table "commentaires"
 * addIndex "idactivites" to table "commentaires"
 * addIndex "PRIMARY" to table "lieux"
 * addIndex "idcategorie" to table "lieux"
 * addIndex "idadmin" to table "lieux"
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2021-11-04T14:34:41.614Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "administrateurs",
            {
                "idadmin": {
                    "type": Sequelize.INTEGER,
                    "field": "idadmin",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "Nom": {
                    "type": Sequelize.STRING(45),
                    "field": "Nom",
                    "allowNull": true
                },
                "Prenom": {
                    "type": Sequelize.STRING(45),
                    "field": "Prenom",
                    "allowNull": true
                },
                "email": {
                    "type": Sequelize.STRING(45),
                    "field": "email",
                    "allowNull": true
                },
                "mdp": {
                    "type": Sequelize.STRING(45),
                    "field": "mdp",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "categorie",
            {
                "idcategorie": {
                    "type": Sequelize.INTEGER,
                    "field": "idcategorie",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "nomcategorie": {
                    "type": Sequelize.STRING(45),
                    "field": "nomcategorie",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "activites",
            {
                "idactivites": {
                    "type": Sequelize.INTEGER,
                    "field": "idactivites",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "Titre": {
                    "type": Sequelize.STRING(45),
                    "field": "Titre",
                    "allowNull": true
                },
                "Image": {
                    "type": Sequelize.STRING(45),
                    "field": "Image",
                    "allowNull": true
                },
                "Description": {
                    "type": Sequelize.TEXT,
                    "field": "Description",
                    "allowNull": true
                },
                "idadmin": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "field": "idadmin",
                    "references": {
                        "model": "administrateurs",
                        "key": "idadmin"
                    },
                    "primaryKey": true,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "lieux",
            {
                "idLieux": {
                    "type": Sequelize.INTEGER,
                    "field": "idLieux",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "Titre": {
                    "type": Sequelize.STRING(45),
                    "field": "Titre",
                    "allowNull": true
                },
                "Image": {
                    "type": Sequelize.STRING(45),
                    "field": "Image",
                    "allowNull": true
                },
                "Description": {
                    "type": Sequelize.TEXT,
                    "field": "Description",
                    "allowNull": true
                },
                "idadmin": {
                    "type": Sequelize.INTEGER,
                    "field": "idadmin",
                    "references": {
                        "model": "administrateurs",
                        "key": "idadmin"
                    },
                    "primaryKey": true,
                    "allowNull": false
                },
                "idcategorie": {
                    "type": Sequelize.INTEGER,
                    "field": "idcategorie",
                    "references": {
                        "model": "categorie",
                        "key": "idcategorie"
                    },
                    "primaryKey": true,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "commentaires",
            {
                "idcom": {
                    "type": Sequelize.INTEGER,
                    "field": "idcom",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "nom": {
                    "type": Sequelize.STRING(45),
                    "field": "nom",
                    "allowNull": true
                },
                "prenom": {
                    "type": Sequelize.STRING(45),
                    "field": "prenom",
                    "allowNull": true
                },
                "commentaire": {
                    "type": Sequelize.STRING(45),
                    "field": "commentaire",
                    "allowNull": true
                },
                "idLieux": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "unique": "commentaires_idLieux_idactivites_unique",
                    "field": "idLieux",
                    "references": {
                        "model": "lieux",
                        "key": "idLieux"
                    },
                    "primaryKey": true,
                    "allowNull": false
                },
                "idactivites": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "unique": "commentaires_idLieux_idactivites_unique",
                    "field": "idactivites",
                    "references": {
                        "model": "activites",
                        "key": "idactivites"
                    },
                    "primaryKey": true,
                    "allowNull": false
                },
                "CreateDate": {
                    "type": Sequelize.DATE,
                    "field": "CreateDate",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "activites",
            [{
                "name": "idactivites"
            }, {
                "name": "idadmin"
            }],
            {
                "indexName": "PRIMARY1",
                "name": "PRIMARY1",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "activites",
            [{
                "name": "idadmin"
            }],
            {
                "indexName": "idadmin",
                "name": "idadmin"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "administrateurs",
            [{
                "name": "idadmin"
            }],
            {
                "indexName": "PRIMARY2",
                "name": "PRIMARY2",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "categorie",
            [{
                "name": "idcategorie"
            }],
            {
                "indexName": "PRIMARY3",
                "name": "PRIMARY3",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "commentaires",
            [{
                "name": "idcom"
            }, {
                "name": "idLieux"
            }, {
                "name": "idactivites"
            }],
            {
                "indexName": "PRIMARY4",
                "name": "PRIMARY4",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "commentaires",
            [{
                "name": "idLieux"
            }],
            {
                "indexName": "idLieux",
                "name": "idLieux"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "commentaires",
            [{
                "name": "idactivites"
            }],
            {
                "indexName": "idactivites",
                "name": "idactivites"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "lieux",
            [{
                "name": "idLieux"
            }, {
                "name": "idadmin"
            }, {
                "name": "idcategorie"
            }],
            {
                "indexName": "PRIMARY5",
                "name": "PRIMARY5",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "lieux",
            [{
                "name": "idcategorie"
            }],
            {
                "indexName": "idcategorie",
                "name": "idcategorie"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "lieux",
            [{
                "name": "idadmin"
            }],
            {
                "indexName": "idadmin",
                "name": "idadmin"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

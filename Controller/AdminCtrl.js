// imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils')
var init = require('../models/init-models');
var Sequelize = require('sequelize')
var config = require('../config/config.json')
var sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: 'localhost',
    dialect: 'mysql'
});
var models = init(sequelize)
var asyncLib = require('async');
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '0gefd5vdys66gvekxo9fff782kdyd';
// constante verif
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

    // Verify
    verifAdminByToken : async (req, res) => {  

        var headerAuth  = req.headers['authorization'];
        var adminId      = await jwtUtils.getAdminId(headerAuth);
        
        if (!adminId){
            return res.status(400).json({ 'error': 'No token' });
        }
        models.administrateurs.findOne({
            attributes: [ 'idadmin', 'email'],
            where: { idadmin: adminId }
        })
        .then((admin) => {
            if (admin) {
                res.status(201).json(admin);
            } else {
                res.status(404).json({ 'error': 'admin not found' });
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ 'error': 'cannot fetch admin' });
        });
    },
    //-----------administrateurs---------------

    register: function (req, res) {

        //Params
        const email = req.body.email;
        const Nom = req.body.Nom;
        const Prenom = req.body.Prenom;
        const mdp = req.body.mdp;

        if (email == null || Nom == null || Prenom == null || mdp == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        // verify email regex , mot de passe et longueur

        if (Nom.length >= 13 || Nom.length <= 4 && Prenom.length >= 13 || Prenom.length <= 4) {
            return res.status(400).json({ 'error': 'le nom et prenom doit contenir entre 5 et 12 caractere' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': "email n'est pas valide" });
        }

        if (!PASSWORD_REGEX.test(mdp)) {
            return res.status(400).json({ 'error': 'mot de passe incorrecte ( doit contenir entre 4 et 8 caractere et au moin un chiffre)' });
        }

        asyncLib.waterfall([
            function (done) {
                models.administrateurs.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then(function (adminFound) {
                        done(null, adminFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "impossible de verifier l'admin" });
                    });
            },
            function (adminFound, done) {
                if (!adminFound) {
                    bcrypt.hash(mdp, 5, function (err, bcryptedPassword) {
                        done(null, adminFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'utilisateur existant' });
                }
            },
            function (adminFound, bcryptedPassword, done) {
                var newAdmin = models.administrateurs.create({
                    email: email,
                    Nom: Nom,
                    Prenom: Prenom,
                    mdp: bcryptedPassword,

                })
                    .then(function (newAdmin) {
                        done(newAdmin);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "impossible d'ajouter l'admin" });
                    });
            }
        ], function (newAdmin) {
            if (newAdmin) {
                return res.status(201).json({
                    'idadmin': newAdmin.idadmin
                });
            } else {
                return res.status(500).json({ 'error': "impossible d'ajouter l'admin" });
            }
        });
    },
    login: function (req, res) {

        //Params
        const email = req.body.email;
        const mdp = req.body.mdp;

        if (email == null || mdp == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        asyncLib.waterfall([
            function (done) {
                models.administrateurs.findOne({
                    where: { email: email }
                })
                    .then(function (adminFound) {
                        done(null, adminFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "impossible de verifier l'admin" });
                    });
            },
            function (adminFound, done) {
                if (adminFound) {
                    bcrypt.compare(mdp, adminFound.mdp, function (errBycrypt, resBycrypt) {
                        done(null, adminFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': "l'admin n'existe pas" });
                }
            },
            function (adminFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(adminFound);
                } else {
                    return res.status(403).json({ 'error': 'mot de passe incorrecte' });
                }
            }
        ], function (adminFound) {
            if (adminFound) {
                return res.status(201).json({
                    'idadmin': adminFound.idadmin,
                    'token': jwtUtils.generateTokenForAdmin(adminFound)
                });
            } else {
                return res.status(500).json({ 'error': "impossible de se connecter a l'utilisateur" });
            }
        });
    },
    getAdminOneProfile: async function (req, res) {

        var headerAuth = req.headers['authorization'];
        var adminId = await jwtUtils.getAdminId(headerAuth);
        console.log(adminId)
        if (adminId < 0)
            return res.status(400).json({ 'error': 'mauvais token' });
            
        models.administrateurs.findOne({
            attributes: ['idadmin', 'email', 'Nom', 'Prenom'],
            where: { idadmin: adminId }
            
        }).then(function (administrateurs) {
            
            if (administrateurs) {
                res.status(201).json(administrateurs);
            } else {
                res.status(404).json({ 'error': 'admin non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer l'admin" });
        });
    },
    getAdminAllProfile: async function (req, res) {

            
        models.administrateurs.findAll({
            attributes: ['idadmin', 'email', 'Nom', 'Prenom'],
            
            
        }).then(function (administrateurs) {
            
            if (administrateurs) {
                res.status(201).json(administrateurs);
            } else {
                res.status(404).json({ 'error': 'admin non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer l'admin" });
        });
    },
    updateAdminProfile: async function (req, res) {

        var headerAuth = req.headers['authorization'];
        var adminId = await jwtUtils.getAdminId(headerAuth);

        // Params
        var Nom = req.body.Nom;

        asyncLib.waterfall([
            function (done) {
                models.administrateurs.findOne({
                    attributes: ['idadmin', 'Nom','Prenom',],
                    where: { idadmin: adminId }
                }).then(function (adminFound) {
                    done(null, adminFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "impossible de vérifier l'utilisateur" });
                    });
            },
            function (adminFound, done) {
                if (adminFound) {
                    adminFound.update({
                        Nom: (Nom ? Nom : adminFound.Nom)
                    }).then(function () {
                        done(adminFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': "impossible de mettre a jour l'admin" });
                    });
                } else {
                    res.status(404).json({ 'error': 'admin non trouver' });
                }
            },
        ], function (adminFound) {
            if (adminFound) {
                return res.status(201).json(adminFound);
            } else {
                return res.status(500).json({ 'error': "impossible de mettre a jour le profil de l'admin" });
            }
        });
    },
    deleteAdminProfile: async function (req, res) {


        asyncLib.waterfall([
            function (done) {
                models.administrateurs.findOne({
                    where: { idadmin: req.query.idadmin }
                })
                    .then(function (adminFound) {
                        done(null, adminFound);
                        
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (adminFound, done) {
                if (adminFound) {
                    adminFound.destroy({
                    })
                        .then(function (adminFound) {
                            done(null, adminFound);
                        })
                        .catch(function (err) {
                            res.status(500).json({ 'error': 'unable to destroy user' });
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },

        ], function (adminFound) {
            if (!adminFound) {
                return res.status(200).json({ 'message': 'user successfully deleted' });
            } else {
                return res.status(500).json({ 'error': 'cannot delete user profile' });
            }
        });
    },

    // ------------activités---------------

    addactivites: async (req,res) => {

        
        var Titre = req.body.Titre
        var Description = req.body.Description
        var Image = req.body.Image
        var idadmin = req.body.idadmin
        
        
        asyncLib.waterfall([
            (done) => {
                
                models.activites.findOne({
                    attributes: ['Titre'],
                    where: { Titre: Titre }
                  })
                  .then((actFound) => {
                    
                    done(null, actFound);
                  })
                  .catch((err) => {
                      console.log(err)
                    return res.status(500).json({ 'error': 'impossible de verifier activites' });
                  });
              },
              (actFound, done) => {
                if (!actFound) {
                      done(null, actFound);
                } else {
                    return res.status(409).json({ 'error': "l'activites existe deja"});
                }
              },
              (actFound, done) => {
                var newActivites = models.activites.create({
                    Titre,
                    Description,
                    Image,
                    idadmin : idadmin
                })
                .then((newActivites) => {
                  done(newActivites);
                })
                .catch((err) => {
                    console.log(err)
                  return res.status(500).json({ 'error': "impossible d'ajouter l'activites" });
                });
              }
            ], (newActivites) => {
                if (newActivites) {
                  return res.status(201).json({
                    'idactivites': newActivites.idactivites,
                    'message': 'Activites successfully created',
                  });
                } else {
                  return res.status(500).json({ 'error': "impossible d'ajouter l'activites" });
                }
            });
    },
    getOneActivites: async function (req, res) {

            
        models.activites.findOne({
            attributes: ['idactivites', 'Titre', 'Description', 'Image'],
            where: { idactivites: req.query.idactivites }
            
        }).then(function (activites) {
            
            if (activites) {
                res.status(201).json(activites);
            } else {
                res.status(404).json({ 'error': 'activites non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer l'activites" });
        });
    },
    getAllActivites: async function (req, res) {

            
        models.activites.findAll({
            attributes: ['idactivites', 'Titre', 'Description', 'Image'],
            
            
        }).then(function (activites) {
            
            if (activites) {
                res.status(201).json(activites);
            } else {
                res.status(404).json({ 'error': 'activites non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer l'activites" });
        });
    },
    updateActivites: async function (req, res) {


        // Params
        var Titre = req.body.Titre;
        var Description = req.body.Description;
        var Image = req.body.Image;
        
        

        asyncLib.waterfall([
            function (done) {
                models.activites.findOne({
                    attributes: ['idactivites','Titre','Description','Image'],
                    where: { idactivites: req.query.idactivites}
                }).then(function (actFound) {
                    done(null, actFound);
                    console.log('iciiiii', actFound)
                })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "impossible de vérifier l'activites" });
                    });
            },
            function (actFound, done) {
                if (actFound) {
                    actFound.update({
                        Titre: (Titre ? Titre : actFound.Titre),
                        Description: (Description ? Description : actFound.Description),
                        Image: (Image ? Image : actFound.Image)
                        
                    }).then(function () {
                        done(actFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': "impossible de mettre a jour l'activites" });
                    });
                } else {
                    res.status(404).json({ 'error': 'activites non trouver' });
                }
            },
        ], function (actFound) {
            if (actFound) {
                return res.status(201).json(actFound);
            } else {
                return res.status(500).json({ 'error': "impossible de mettre a jour le profil de l'activites" });
            }
        });
    },
    deleteActivites: async function (req, res) {


        asyncLib.waterfall([
            function (done) {
                models.activites.findOne({
                    where: { idactivites: req.query.idactivites}
                })
                    .then(function (actFound) {
                        done(null, actFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify activites' });
                    });
            },
            function (actFound, done) {
                if (actFound) {
                    actFound.destroy({
                    })
                        .then(function (actFound) {
                            done(null, actFound);
                        })
                        .catch(function (err) {
                            res.status(500).json({ 'error': 'unable to destroy activites' });
                        });
                } else {
                    res.status(404).json({ 'error': 'activites not found' });
                }
            },

        ], function (actFound) {
            if (!actFound) {
                return res.status(200).json({ 'message': 'activites successfully deleted' });
            } else {
                return res.status(500).json({ 'error': 'cannot delete activites' });
            }
        });
    },

    //--------------lieux--------------

    addlieux: async (req,res) => {


        let idcategorie = req.body.idcategorie
        var Titre = req.body.Titre
        var Description = req.body.Description
        var Image = req.body.Image
        var idadmin = req.body.idadmin
        
        

        asyncLib.waterfall([
            (done) => {
                
                models.lieux.findOne({
                    attributes: ['Titre'],
                    where: { Titre: Titre }
                  })
                  .then((lieuxFound) => {
                    
                    done(null, lieuxFound);
                  })
                  .catch((err) => {
                      console.log(err)
                    return res.status(500).json({ 'error': 'impossible de verifier le lieux' });
                  });
              },
              (lieuxFound, done) => {
                if (!lieuxFound) {
                      done(null, lieuxFound);
                } else {
                    return res.status(409).json({ 'error': "le lieux existe deja"});
                }
            },
              (lieuxFound, done) => {
                var newLieux = models.lieux.create({
                    idcategorie: req.body.idcategorie,
                    Titre: req.body.Titre,
                    Description : req.body.Description,
                    Image : req.body.Image,
                    idadmin: idadmin
                    
                })
                .then((newLieux) => {
                  done(newLieux);
                })
                .catch((err) => {
                    console.log(err)
                  return res.status(500).json({ 'error': "impossible d'ajouter le lieux" });
                });
              }
            ], (newLieux) => {
                if (newLieux) {
                  return res.status(201).json({
                    'idLieux': newLieux.idLieux,
                    'message': 'Lieux successfully created',
                  });
                } else {
                  return res.status(500).json({ 'error': "impossible d'ajouter le lieux" });
                }
            });
    },
    getOneLieux: async function (req, res) {

        
            
        models.lieux.findOne({
            attributes: ['idLieux','idcategorie', 'Titre', 'Description', 'Image'],
            where: { idLieux: req.query.idLieux }
            
        }).then(function (lieux) {
            
            if (lieux) {
                res.status(201).json(lieux);
            } else {
                res.status(404).json({ 'error': 'lieux non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer le lieux" });
        });
    },
    getAllLieux: async function (req, res) {

            
        models.lieux.findAll({
            attributes: ['idLieux','idcategorie', 'Titre', 'Description', 'Image'],
            
            
        }).then(function (lieux) {
            
            if (lieux) {
                res.status(201).json(lieux);
            } else {
                res.status(404).json({ 'error': 'lieux non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer le lieux" });
        });
    },
    getAllLieuxMontagnes: async function (req, res) {

            
        models.lieux.findAll({
            attributes: ['idLieux','idcategorie', 'Titre', 'Description', 'Image'],
            where: { idcategorie: 1 }
            
        }).then(function (lieux) {
            
            if (lieux) {
                res.status(201).json(lieux);
            } else {
                res.status(404).json({ 'error': 'lieux non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer le lieux" });
        });
    },
    getAllLieuxPlages: async function (req, res) {

            
        models.lieux.findAll({
            attributes: ['idLieux','idcategorie', 'Titre', 'Description', 'Image'],
            where: { idcategorie: 2 }
            
        }).then(function (lieux) {
            
            if (lieux) {
                res.status(201).json(lieux);
            } else {
                res.status(404).json({ 'error': 'lieux non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer le lieux" });
        });
    },
    getAllLieuxRivieres: async function (req, res) {

            
        models.lieux.findAll({
            attributes: ['idLieux','idcategorie', 'Titre', 'Description', 'Image'],
            where: { idcategorie: 3 }
            
        }).then(function (lieux) {
            
            if (lieux) {
                res.status(201).json(lieux);
            } else {
                res.status(404).json({ 'error': 'lieux non trouvé' });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': "impossible de récupérer le lieux" });
        });
    },
    updateLieux: async function (req, res) {


        // Params
        let Titre = req.body.Titre;
        let Description = req.body.Description;
        let Image = req.body.Image;
        let idadmin = adminId;
        let idcategorie = req.body.idcategorie

        asyncLib.waterfall([
            function (done) {
                models.lieux.findOne({
                    attributes: ['idLieux','Titre','Description','Image','idcategorie'],
                    where: { idLieux: req.query.idLieux }
                }).then(function (lieuxFound) {
                    done(null, lieuxFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': "impossible de vérifier le lieux" });
                    });
            },
            function (lieuxFound, done) {
                if (lieuxFound) {
                    lieuxFound.update({
                        Titre: (Titre ? Titre : lieuxFound.Titre),
                        Description: (Description ? Description : lieuxFound.Description),
                        Image: (Image ? Image : lieuxFound.Image),
                        idcategorie: (idcategorie ? idcategorie : lieuxFound.idcategorie),
                        idadmin: (idadmin ? idadmin : lieuxFound.idadmin)
                    }).then(function () {
                        done(lieuxFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': "impossible de mettre a jour le lieux" });
                    });
                } else {
                    res.status(404).json({ 'error': 'lieux non trouver' });
                }
            },
        ], function (lieuxFound) {
            if (lieuxFound) {
                return res.status(201).json(lieuxFound);
            } else {
                return res.status(500).json({ 'error': "impossible de mettre a jour le lieux" });
            }
        });
    },
    deleteLieux: async function (req, res) {


        asyncLib.waterfall([
            function (done) {
                models.lieux.findOne({
                    where: { idLieux: req.query.idLieux}
                })
                    .then(function (lieuxFound) {
                        done(null, lieuxFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify lieux' });
                    });
            },
            function (lieuxFound, done) {
                if (lieuxFound) {
                    lieuxFound.destroy({
                    })
                        .then(function (lieuxFound) {
                            done(null, lieuxFound);
                        })
                        .catch(function (err) {
                            res.status(500).json({ 'error': 'unable to destroy lieux' });
                        });
                } else {
                    res.status(404).json({ 'error': 'lieux not found' });
                }
            },

        ], function (lieuxFound) {
            if (!lieuxFound) {
                return res.status(200).json({ 'message': 'lieux successfully deleted' });
            } else {
                return res.status(500).json({ 'error': 'cannot delete lieux' });
            }
        });
    },

}
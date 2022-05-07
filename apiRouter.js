// Imports
const express = require('express');
const AdminCtrl = require('./Controller/AdminCtrl');


// Router
exports.router = (function(){
    const apiRouter = express.Router();
// verify
apiRouter.route('/admin/verify/').get(AdminCtrl.verifAdminByToken);
//Admin routes

apiRouter.route('/admin/register/').post(AdminCtrl.register);
apiRouter.route('/admin/login/').post(AdminCtrl.login);
apiRouter.route('/admin/OneAdmin/').get(AdminCtrl.getAdminOneProfile);
apiRouter.route('/admin/AllAdmin/').get(AdminCtrl.getAdminAllProfile);
apiRouter.route('/admin/upAdmin/').put(AdminCtrl.updateAdminProfile);
apiRouter.route('/admin/delete/').delete(AdminCtrl.deleteAdminProfile);

apiRouter.route('/admin/addactivites/').post(AdminCtrl.addactivites);
apiRouter.route('/admin/oneactivites/').get(AdminCtrl.getOneActivites);
apiRouter.route('/admin/allactivites/').get(AdminCtrl.getAllActivites);
apiRouter.route('/admin/upactivites/').put(AdminCtrl.updateActivites);
apiRouter.route('/admin/delete/activites/').delete(AdminCtrl.deleteActivites);

apiRouter.route('/admin/addlieux/').post(AdminCtrl.addlieux);
apiRouter.route('/admin/onelieux/').get(AdminCtrl.getOneLieux);
apiRouter.route('/admin/alllieux/').get(AdminCtrl.getAllLieux);
apiRouter.route('/admin/alllieuxMontagnes/').get(AdminCtrl.getAllLieuxMontagnes);
apiRouter.route('/admin/alllieuxPlages/').get(AdminCtrl.getAllLieuxPlages);
apiRouter.route('/admin/alllieuxRivieres/').get(AdminCtrl.getAllLieuxRivieres);
apiRouter.route('/admin/uplieux/').put(AdminCtrl.updateLieux);
apiRouter.route('/admin/delete/lieux/').delete(AdminCtrl.deleteLieux);



return apiRouter
})();
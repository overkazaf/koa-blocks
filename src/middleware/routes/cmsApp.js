const Router = require('koa-router');
const logger = require('log4js').getLogger();
const cmsAppCtrl = require('../controllers/cmsApp');
const koaBody = require('koa-body');

logger.level = 'debug';

const router = new Router({
  prefix: 'cms'
});

// default routers
router.get('/app/:bundleId:/version', ctx => cmsAppCtrl.findOne.call(null, ctx));
router.get('/apps/:bundleId', ctx => cmsAppCtrl.findAll.call(null, ctx));
router.get('/apps/:bundleId', ctx => cmsAppCtrl.pageFind.call(null, ctx));
router.put('/app', ctx => cmsAppCtrl.saveOne.call(null, ctx));
router.put('/apps', ctx => cmsAppCtrl.saveAll.call(null, ctx));
router.delete('/app/:bundleId/:version', ctx => cmsAppCtrl.removeOne.call(null, ctx));
router.delete('/apps/bundleId', ctx => cmsAppCtrl.removeAll.call(null, ctx));
router.post('/app', ctx => cmsAppCtrl.updateOne.call(null, ctx));
router.post('/apps', ctx => cmsAppCtrl.updateAll.call(null, ctx));

// extend routers
// Extended plugin system is under development
module.exports = router;

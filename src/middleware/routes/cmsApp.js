const Router = require('koa-router');
const logger = require('log4js').getLogger();
const cmsAppCtrl = require('../controllers/cmsApp');
const koaBody = require('koa-body');

logger.level = 'debug';

const router = new Router({
  prefix: '/cms'
});

// default routers
router.get('/app/:bundleId/:version', ctx => cmsAppCtrl.findOne.call(null, ctx));
router.get('/apps/:bundleId', ctx => cmsAppCtrl.findAll.call(null, ctx));
router.get('/apps/:bundleId/:pageSize/:pageNo', ctx => cmsAppCtrl.pageFind.call(null, ctx));
router.put('/app', koaBody({textLimit: "2mb"}), ctx => cmsAppCtrl.saveOne.call(null, ctx));
router.put('/apps', koaBody({textLimit: "2mb"}), ctx => cmsAppCtrl.saveAll.call(null, ctx));
router.del('/app/:bundleId/:version', ctx => cmsAppCtrl.removeOne.call(null, ctx));
router.del('/apps/:bundleId', ctx => cmsAppCtrl.removeAll.call(null, ctx));
router.post('/app', koaBody({textLimit: "2mb"}), ctx => cmsAppCtrl.updateOne.call(null, ctx));
router.post('/apps', koaBody({textLimit: "2mb"}), ctx => cmsAppCtrl.updateAll.call(null, ctx));

// extend routers
// Extended plugin system is under development
module.exports = router;

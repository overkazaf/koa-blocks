const Router = require('koa-router');
const logger = require('log4js').getLogger();
const cmsAppCtrl = require('../controllers/cmsApp');
const koaBody = require('koa-body');

logger.level = 'debug';

const router = new Router({
  prefix: 'cms/'
});

// default routers
router.get('app/:bundleId:/version', cmsAppCtrl.findOne)
router.get('apps/:bundleId', cmsAppCtrl.findAll)
router.get('apps/:bundleId', cmsAppCtrl.pageFind)
router.put('app', cmsAppCtrl.saveOne)
router.put('apps', cmsAppCtrl.saveAll)
router.delete('app', cmsAppCtrl.removeOne)
router.delete('apps', cmsAppCtrl.removeAll)
router.post('app', cmsAppCtrl.updateOne)
router.post('apps', cmsAppCtrl.updateAll)

// extend routers
EXTEND
module.exports = router;

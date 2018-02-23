const Router = require('koa-router');
const logger = require('log4js').getLogger();
const {{ctrlName}}Ctrl = require('../controllers/{{ctrlName}}');
const koaBody = require('koa-body');

logger.level = 'debug';

const router = new Router({
  prefix: '{{prefix}}'
});

// default routers
{{DEFAULT}}

// extend routers
{{EXTEND}}
module.exports = router;

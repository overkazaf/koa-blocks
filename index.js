const Koa = require('koa');
const nextApp = require('next');
const Router = require('koa-router');
const error = require('koa-json-error');
const cache = require('koa-cache-lite');
const logger = require('log4js').getLogger();
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const app = nextApp({ dev });
const cors = require('kcors');
const cmsAppRoute = require('./src/middleware/routes/cmsApp.js');

logger.level = 'debug';
// const ssrCache = new LRUCache({
//     max: 100,
//     maxAge: 1000 * 60 * 60, // 1hour
// });

const port = process.argv[2] || 3001;

// 用于做读写分离的字典，在基于Cache Aside的缓存策略中，可以在调用写服务前立即让相关的缓存失效
const FormWriteServiceUrlMap = {
    SAMPLE_URL: 1,
};

function matchesFormWriteServiceUrl(url) {
    return url in FormWriteServiceUrlMap;
}

function initModels() {
  var fs = require('fs');
  var models_path = __dirname + '/src/middleware/entities';
  var models = fs.readdirSync(models_path);
  // NOTE: some models seem to be broken. once fixed, the following code will work

  models.forEach(function (file) {
    if (~file.indexOf('.js')) {
      //console.log('Trying to require %s',file);
      require(models_path + '/' + file);
    }
  });
}


// routes
app.prepare()
    .then(() => {
        const server = new Koa();
        const router = new Router();

        mongoose.connect('mongodb://localhost/test');
        const db = mongoose.connection;

        db.on('error', function(err) {
          console.error('error occurs:', JSON.stringify(err));
          mongoose.disconnect();
        });

        db.once('open', function(err) {
          if (err) {
            console.error(JSON.stringify(err));
            return;
          }
          initModels();
          console.log('mongoose opened...');

          const cmsApp = mongoose.model('CMSApp');

          cmsApp.find({
            bundldId: 'com.tucao.test',
            version: '1.0.0',
          }).then(collection => {
            console.log('CMSApp v1.0.0 collection', collection);
          });
        });


        server.use(function* logResponse(next) {
            const start = new Date();
            yield next;
            const ms = new Date() - start;
            this.set('X-Response-Time', `${ms}ms`);
        });

        server.use(function* cacheCtrl(next) {
            const start = new Date();
            yield next;
            const ms = new Date() - start;
            logger.log('%s %s -- %s ms', this.method, this.url, ms);
            if (matchesFormWriteServiceUrl(this.url)) {
                // 有写操作时，立即让相关的缓存失效，目前只有个LIST的KEY
                const cacheKey = 'LIST';
                if (global.lruCache != null && global.lruCache.has(cacheKey)) {
                    global.lruCache.del(cacheKey);
                }
            }
        });

        // 设置CORS权限
        server.use(cors({
            'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Origin': '*',
        }));

        // slice routers
        server.use(cmsAppRoute.routes(), cmsAppRoute.allowedMethods());

        // global routers
        server.use(router.routes(), router.allowedMethods());

        // 错误监听;
        server.use(error());

        // 缓存几个读的接口
        cache.configure({
            '/cms/app/:bundleId/:version': 3000,
            '/cms/apps/:bundleId': 3000,
        }, {
            debug: dev,
        });

        server.use(cache.middleware());

        server.listen(port, (err) => {
            if (err) throw err;
            logger.log(`> Ready on http://localhost:${port}`);
        });
    });
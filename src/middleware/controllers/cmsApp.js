const mongoose = require('mongoose');
const ResponseDTO = require('../entity/ResponseDTO');

/**
 * 模板代码，默认生成的CMSApp 相关CRUD接口（单个及批量的方式）
 */
// <Default>
// route:  GET /cms/template/:p1/:p2/.../:pN
exports.findOne = async function(ctx) {
  // find single model instance
  const CMSApp = mongoose.model('CMSApp');
  return await CMSApp.findOne(ctx.params, function(err, data) {
    if (err) {
      ctx.body = JSON.stringify({
        code: 'MODEL_ERROR_CODE.FIND_ONE',
        msg: 'MODEL_ERROR_MSG.FIND_ONE',
        data: err,
      });
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        msg: 'MODEL_SUCCESS_MSG.FIND_ONE',
        data: data,
      });
    }
  });
}

// route:  GET /cms/templates/:p1/:p2/.../:pN
exports.findAll = async function(ctx) {
  // find multiple model instances
  const CMSApp = mongoose.model('CMSApp');

  return await CMSApp.find(ctx.params, (err, data) => {
    if (err) {
      ctx.body = JSON.stringify({
        code: 'MODEL_ERROR_CODE.FIND_ALL',
        msg: 'MODEL_ERROR_MSG.FIND_ALL',
        data: err,
      });
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        msg: 'MODEL_SUCCESS_MSG.FIND_ALL',
        data: data,
      });
    }
  });
}

exports.pageFind = async function(ctx) {
  // find multiple model instances by pagination
  const {
    pageNo,
    pageSize,
  } = ctx.params;
  const skipnum = (pageNo - 1) * pageSize;
  const condition = Object.assign({}, ctx.params);
  delete condition.pageNo;
  delete condition.pageSize;

  return await CMSApp.find(condition).skip(skipnum).limit(pageSize).exec(function(err, data) {
    if (err) {
      ctx.body = JSON.stringify({
        code: 'MODEL_ERROR_CODE.PAGE_FIND',
        msg: 'MODEL_ERROR_MSG.PAGE_FIND',
        data: err,
      });
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        msg: 'MODEL_SUCCESS_MSG.PAGE_FIND',
        data: data,
      });
    }
  });
}

// route:  PUT /cms/template koaBody({ textLimit: limitation })
exports.saveOne = async function(ctx) {
  // save single model instance
  const cmsappParam = ctx.request.body;
  const CMSApp = mongoose.model('CMSApp');
  
  return await CMSApp.findOne(cmsappParam).then(cmsapp => {
    if (!cmsapp) {
      const newCMSApp = new CMSApp(cmsappParam);
      return newCMSApp.save().then((data) => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully save model cmsapp', data));
      }).catch(err => {
        ctx.body = JSON.stringify(new ResponseDTO(1111, 'Failed to save model cmsapp', err));
      });
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'Model cmsapp has been existed...', data));
    }
  });

}

exports.saveAll = async function(ctx) {
  // save multiple model instances
  // we assume that the passed parameter named "cmsapps"
  const { cmsapps } = ctx.request.body;
  const CMSApp = mongoose.model('CMSApp');
  // check
  const batchCheckArray = cmsapps.map(cmsapp => {
    return CMSApp.findOne(cmsapp);
  });
  return Promise.all(batchCheckArray).then((jobs) =>{
    const filteredJobs = jobs.filter(job => job != null);
    if (filteredJobs.length) {
      ctx.body = JSON.stringify(new ResponseDTO(1111, 'Model cmsapp has been existed', filteredJobs.map(job => {
        return {
          _id: job._id,
        };
      })));
    } else {
     // batching save models
     return CMSApp.create(cmsapps, (err, data) => {
       if (err) {
         ctx.body = JSON.stringify(new ResponseDTO(2222, 'Failed to save multiple cmsapps', err));
       } else {
         ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully save multiple cmsapps', data));
       }
     });
    }
  }).catch(err => {
    ctx.body = JSON.stringify(new ResponseDTO(2223, 'Failed to save multiple cmsapps in error', err));
  });
}

// route:  DELETE /cms/template koaBody({ textLimit: limitation })
exports.removeOne = async function(ctx) {
  // remove single model instance
  const CMSApp = mongoose.model('CMSApp');
  return await CMSApp.findOne(ctx.params).then((app) => {
    if (!app) {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'No need to remove CMSApp model in DB, there is no such cmsapp'));
    } else {
      return app.remove().then((app) => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully remove CMSApp models', app));
      }).catch(err => {
        throw err;
      });
    }
  }).catch(err => {
    ctx.body = JSON.stringify(new ResponseDTO(1111, 'Error occurs when finding CMSApp model in DB'));
  });
}

exports.removeAll = async function(ctx) {
  // remove multiple model instances
  const CMSApp = mongoose.model('CMSApp');
  const cmsappParams = ctx.params;

  return await CMSApp.find(cmsappParams).then((collections) => {
    if (collections) {
      const batchRemoveJobs = collections.map((collction) => {
        if (collction) {
          return collction.remove().then(res => res);
        } else {
          return void 0;
        }
      });

      return Promise.all(batchRemoveJobs).then((res) => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully remove CMSApp models in DB', res));
      });
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'No need to remove CMSApp models in DB, there is no such cmsapp'));
    }
  });
}

// route:  POST /cms/template koaBody({ textLimit: limitation })
exports.updateOne = async function(ctx) {
  // update single model instance
  const CMSApp = mongoose.model('CMSApp');
  return await CMSApp.findOne(ctx.request.body).then(res => {
    if (res) {
      const newCMSApp = new CMSApp(ctx.request.body);
      return newCMSApp.update().then(res => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully update CMSApp model', res));
      }).catch(err => {
        ctx.body = JSON.stringify(new ResponseDTO(1111, 'Error occurs while updating CMSApp model', err));
      });
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'There is no valid CMSApp model to update', null));
    }
  });
}

exports.updateAll = async function(ctx) {
  // update multiple model instances
  const CMSApp = mongoose.model('CMSApp');
  const { cmsapps } = ctx.request.body;
  const batchFindJobs = cmsapps.map(cmsapp => {
    const whereParam = Object.assign({}, {
      _id: cmsapp._id,
    });
    return CMSApp.findOne(whereParam).then(res => {
      return res;
    });
  });
  return await Promise.all(batchFindJobs).then(results => {
    const newResults = results.filter(res => res != null);
    if (newResults.length === results.length) {
      const batchUpdateJobs = cmsapps.map((cmsapp) => {
        const safeCMSApp = Object.assign({}, cmsapp);
        delete safeCMSApp._id;
        const whereParam = Object.assign({}, {
          _id: cmsapp._id,
        });
        return CMSApp.update(whereParam, safeCMSApp).then(res => res);
      });
      return Promise.all(batchUpdateJobs).then(res => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully update all CMSApp models', res));
      })
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'There is invalid CMSApp model to update', null));
    }
  });
}

// </Default>

/**
 * 自定义代码，这部分需要结合业务进行实现，如单个实体的复杂操作，多个实体间的关联操作等
 */

// <Extend>
// We can expose this to allow developers to implement diverse plugins
exports.methodName = async function(ctx) {
  // todo this

}

// </Extend>
const mongoose = require('mongoose');
const ResponseDTO = require('../entity/ResponseDTO');

/**
 * 模板代码，默认生成的{{Model}} 相关CRUD接口（单个及批量的方式）
 */
// <Default>
// route:  GET /cms/template/:p1/:p2/.../:pN
exports.findOne = async function(ctx) {
  // find single model instance
  const {{Model}} = mongoose.model('{{Model}}');
  return await {{Model}}.findOne(ctx.params, function(err, data) {
    if (err) {
      ctx.body = JSON.stringify({
        code: '{{MODEL_ERROR_CODE.FIND_ONE}}',
        message: '{{MODEL_ERROR_MSG.FIND_ONE}}',
        data: err,
      });
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        message: '{{MODEL_SUCCESS_MSG.FIND_ONE}}',
        data: data,
      });
    }
  });
}

// route:  GET /cms/templates/:p1/:p2/.../:pN
exports.findAll = async function(ctx) {
  // find multiple model instances
  const {{Model}} = mongoose.model('{{Model}}');

  return await {{Model}}.find(ctx.params, (err, data) => {
    if (err) {
      ctx.body = JSON.stringify({
        code: '{{MODEL_ERROR_CODE.FIND_ALL}}',
        message: '{{MODEL_ERROR_MSG.FIND_ALL}}',
        data: err,
      });
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        message: '{{MODEL_SUCCESS_MSG.FIND_ALL}}',
        data: data,
      });
    }
  });
}

exports.pageFind = async function(ctx) {
  // find multiple model instances by pagination
  const {{Model}} = mongoose.model('{{Model}}');

  const {
    pageNo,
    pageSize,
  } = ctx.params;
  const skipnum = (pageNo - 1) * pageSize;
  const condition = Object.assign({}, ctx.params);
  delete condition.pageNo;
  delete condition.pageSize;

  return await {{Model}}.find(condition).skip(skipnum).limit(+pageSize).exec(function(err, data) {
    if (err) {
      ctx.body = JSON.stringify({
        code: '{{MODEL_ERROR_CODE.PAGE_FIND}}',
        message: '{{MODEL_ERROR_MSG.PAGE_FIND}}',
        data: err,
      });
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        message: '{{MODEL_SUCCESS_MSG.PAGE_FIND}}',
        data: data,
      });
    }
  });
}

// route:  PUT /cms/template koaBody({ textLimit: limitation })
exports.saveOne = async function(ctx) {
  // save single model instance
  const {{model}}Param = ctx.request.body;
  const {{Model}} = mongoose.model('{{Model}}');
  
  return await {{Model}}.findOne({{model}}Param).then({{model}} => {
    if (!{{model}}) {
      const new{{Model}} = new {{Model}}({{model}}Param);
      return new{{Model}}.save().then((data) => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully save model {{model}}', data));
      }).catch(err => {
        ctx.body = JSON.stringify(new ResponseDTO(1111, 'Failed to save model {{model}}', err));
      });
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'Model {{model}} has been existed...', data));
    }
  });

}

exports.saveAll = async function(ctx) {
  // save multiple model instances
  // we assume that the passed parameter named "{{models}}"
  const { {{models}} } = ctx.request.body;
  const {{Model}} = mongoose.model('{{Model}}');
  // check
  const batchCheckArray = {{models}}.map({{model}} => {
    return {{Model}}.findOne({{model}});
  });
  return Promise.all(batchCheckArray).then((jobs) =>{
    const filteredJobs = jobs.filter(job => job != null);
    if (filteredJobs.length) {
      ctx.body = JSON.stringify(new ResponseDTO(1111, 'Model {{model}} has been existed', filteredJobs.map(job => {
        return {
          _id: job._id,
        };
      })));
    } else {
     // batching save models
     return {{Model}}.create({{models}}, (err, data) => {
       if (err) {
         ctx.body = JSON.stringify(new ResponseDTO(2222, 'Failed to save multiple {{models}}', err));
       } else {
         ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully save multiple {{models}}', data));
       }
     });
    }
  }).catch(err => {
    ctx.body = JSON.stringify(new ResponseDTO(2223, 'Failed to save multiple {{models}} in error', err));
  });
}

// route:  DELETE /cms/template koaBody({ textLimit: limitation })
exports.removeOne = async function(ctx) {
  // remove single model instance
  const {{Model}} = mongoose.model('{{Model}}');
  return await {{Model}}.findOne(ctx.params).then((app) => {
    if (!app) {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'No need to remove {{Model}} model in DB, there is no such {{model}}'));
    } else {
      return app.remove().then((app) => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully remove {{Model}} models', app));
      }).catch(err => {
        throw err;
      });
    }
  }).catch(err => {
    ctx.body = JSON.stringify(new ResponseDTO(1111, 'Error occurs when finding {{Model}} model in DB'));
  });
}

exports.removeAll = async function(ctx) {
  // remove multiple model instances
  const {{Model}} = mongoose.model('{{Model}}');
  const {{model}}Params = ctx.params;

  return await {{Model}}.find({{model}}Params).then((collections) => {
    if (collections) {
      const batchRemoveJobs = collections.map((collction) => {
        if (collction) {
          return collction.remove().then(res => res);
        } else {
          return void 0;
        }
      });

      return Promise.all(batchRemoveJobs).then((res) => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully remove {{Model}} models in DB', res));
      });
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'No need to remove {{Model}} models in DB, there is no such {{model}}'));
    }
  });
}

// route:  POST /cms/template koaBody({ textLimit: limitation })
exports.updateOne = async function(ctx) {
  // update single model instance
  const {{Model}} = mongoose.model('{{Model}}');
  return await {{Model}}.findOne(ctx.request.body).then(res => {
    if (res) {
      const new{{Model}} = new {{Model}}(ctx.request.body);
      return new{{Model}}.update().then(res => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully update {{Model}} model', res));
      }).catch(err => {
        ctx.body = JSON.stringify(new ResponseDTO(1111, 'Error occurs while updating {{Model}} model', err));
      });
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'There is no valid {{Model}} model to update', null));
    }
  });
}

exports.updateAll = async function(ctx) {
  // update multiple model instances
  const {{Model}} = mongoose.model('{{Model}}');
  const { {{models}} } = ctx.request.body;
  const batchFindJobs = {{models}}.map({{model}} => {
    const whereParam = Object.assign({}, {
      _id: {{model}}._id,
    });
    return {{Model}}.findOne(whereParam).then(res => {
      return res;
    });
  });
  return await Promise.all(batchFindJobs).then(results => {
    const newResults = results.filter(res => res != null);
    if (newResults.length === results.length) {
      const batchUpdateJobs = cmsapps.map(({{model}}) => {
        const safe{{Model}} = Object.assign({}, {{model}});
        delete safe{{Model}}._id;
        const whereParam = Object.assign({}, {
          _id: {{model}}._id,
        });
        return {{Model}}.update(whereParam, safe{{Model}}).then(res => res);
      });
      return Promise.all(batchUpdateJobs).then(res => {
        ctx.body = JSON.stringify(new ResponseDTO(0, 'Successfully update all {{Model}} models', res));
      })
    } else {
      ctx.body = JSON.stringify(new ResponseDTO(2222, 'There is invalid {{Model}} model to update', null));
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
const mongoose = require('mongoose');

/**
 * 模板代码，默认生成的CMSApp 相关CRUD接口（单个及批量的方式）
 */
// <Default>
// route:  GET /cms/template/:p1/:p2/.../:pN
exports.findOne = async function(ctx) {
  // find single model instance
  const CMSApp = mongoose.model('CMSApp');
  CMSApp.findOne(ctx.params, function(err, data) {
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
  CMSApp.find(ctx.params, function(err, data) {
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

  CMSApp.find(condition).skip(skipnum).limit(pageSize).exec(function(err, data) {
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

}
exports.saveAll = async function(ctx) {
  // save multiple model instances

}

// route:  DELETE /cms/template koaBody({ textLimit: limitation })
exports.removeOne = async function(ctx) {
  // remove single model instance

}
exports.removeAll = async function(ctx) {
  // remove multiple model instances

}

// route:  POST /cms/template koaBody({ textLimit: limitation })
exports.updateOne = async function(ctx) {
  // update single model instance

}
exports.updateAll = async function(ctx) {
  // update multiple model instances

}

// </Default>

/**
 * 自定义代码，这部分需要结合业务进行实现，如单个实体的复杂操作，多个实体间的关联操作等
 */

// <Extend>
exports.methodName = async function(ctx) {
  // todo this

}

// </Extend>
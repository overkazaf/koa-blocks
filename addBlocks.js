const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const config = require('./define/blocks.js');

function pipe(cpstd) {
    cpstd.stdout.pipe(process.stdout);
    cpstd.stderr.pipe(process.stderr);
}

function camelize(str) {
    return str.replace(/^([A-Z]+)([A-Z])/, function(match, $1, $2) {
        return match.replace($1, $1.toLowerCase());
    });
}

/**
 * [cleanUselessJSCode 
 *     This function is aim to optimize and produce a cleaner js file, which remove all the useless
 *     js function and variables definitions
 * ]
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
function cleanUselessJSCode(code) {
    try {
        const ast = esprima.parse(code);
        // console.log('cleanUselessCode', ast);t
    } catch(e) {

        console.error("||||||||||||||||||||||||||||||||||||||||");
        console.error("|| Failed to generate valid js file!!!", e);
        console.error("|| Failed to generate valid js file!!!", e);
        console.error("|| Failed to generate valid js file!!!", e);
        console.error("|| Failed to generate valid js file!!!", e);
        console.error("||||||||||||||||||||||||||||||||||||||||");
    }

    return code;
}

function compileFileSync(metaType, config) {
    if (metaType === 'Schema') {
        const tpl = fs.readFileSync(path.join(__dirname, 'tpls/model.tpl'));
        const targetContent = tpl.toString().replace(/{{(.*?)}}/gm, function(match, group) {
            if (group === 'SchemaName') {
                return config.name;
            } else if (group === 'schemaName') {
                return camelize(config.name);
            } else if (group === 'SCHEMA_CONTENT'){
                return Schema.prototype.buildSchemaContent(config);
            } else {
                return group;
            }
        });
        return targetContent;
    } else if (metaType === 'Controller') {
        const tpl = fs.readFileSync(path.join(__dirname, 'tpls/controller.tpl'));
        const targetContent = tpl.toString().replace(/{{(.*?)}}/gm, function(match, group) {
            if (group === 'Model') {
                return config.model;
            } else if (group === 'model') {
                return config.model.toLowerCase();
            } else if (group === 'models') {
                return config.model.toLowerCase() + 's';
            } else {
                return group;
            }
        });
        return targetContent;
    } else if (metaType === 'Route') {
        const tpl = fs.readFileSync(path.join(__dirname, 'tpls/route.tpl'));
        const targetContent = tpl.toString().replace(/{{(.*?)}}/gm, function(match, group) {
            if (group === 'ctrlName') {
                return config.ctrlName;
            } else if (group === 'prefix') {
                return config.prefix;
            } else if (group === 'DEFAULT') {
                const routersContent = config.routes.map(function(route) {
                    const { method, path, controller } = route;
                    const parseBody = method == 'PUT' || method == 'POST' ? 'koaBody({textLimit: "2mb"}), ' : '';
                    return `router.${method.toLowerCase()}('${path}', ${parseBody}ctx => ${config.ctrlName}Ctrl.${controller.substring(1)}.call(null, ctx));`;
                });

                return routersContent.join('\r\n');
            } else if (group === 'EXTEND') {
                return '// Extended plugin system is under development';
            } else {
                return group;
            }
        });
        return targetContent;
    }
}

function Blocks(config) {
    this.config = config;
    this.initModels();
}

function Meta(type) {
    return {
        type: type,
        timestamp: new Date().getTime()
    };
}

function Schema(schema) {
    const _default = {
        meta: new Meta('Schema')
    };
    return Object.assign(_default, schema);
}

function propValueGenFn(type, fn) {
    const [
        valueType,
        methodName
    ] = fn.split(':');
    return `{
        type: '${type}',
        default: function genUUID() {
            return uuid.v1();
        }
    }`;
}

Schema.prototype.buildSchemaContent = function(config) {
    const { properties, propDefSeperator } = config;
    const content = Object.keys(properties).map(function(propKey, index) {
        if (~properties[propKey].indexOf(propDefSeperator)) {
            const [
                type,
                fn,
            ] = properties[propKey].split(propDefSeperator);

            const generatedPropValue = propValueGenFn(type, fn);

            return `${propKey}: ${generatedPropValue},`;
        } else if (typeof properties[propKey] === 'object') {
            // 含外键的场景
            return `${propKey}: ${properties[propKey]},`;
        } else {
            return `${propKey}: ${properties[propKey]},`;
        }
    });
    console.log('schemaContent', content);
    return content.join('\r\n\t');
}

function Route(route) {
    const _default = {
        meta: new Meta('Route')
    };
    return Object.assign(_default, route);
}

function Controller(controller) {
    const _default = {
        meta: new Meta('Controller')
    };
    return Object.assign(_default, controller);
}

function Model(model) {
    const {
        id,
        force,
        schema,
        route,
        controller,
    } = model;

    this.meta = new Meta('Model');
    this.id = id;
    this.force = force;
    this.schema = new Schema(schema);
    this.route = new Route(route);
    this.controller = new Controller(controller);
}



Model.prototype.build = async function() {
    if (this.force) {
        await this.buildSchema();
        await this.buildRoute();
        await this.buildController();
    }
}

Model.prototype.buildComponent = async function(type) {
    const {
        dest,
        name,
    } = this[type];

    const cpstd = await cp.exec(`mkdir -p ${dest}`);
    pipe(cpstd);

    const fileName = `${dest}/${name}.js`;
    const fd = fs.openSync(fileName, 'w+');
    const componentName = type.charAt(0).toUpperCase() + type.substring(1);
    const content = compileFileSync(componentName, this[type], this[type]);
    const cleanedContent = cleanUselessJSCode(content);
    return await fs.write(fd, `${cleanedContent}`, function(err, length) {
        if (err) throw err;
        console.log(`${componentName} has been successfully generated with length: `, length);
    });
}

Model.prototype.buildSchema = function() {
    Model.prototype.buildComponent.call(this, 'schema');
}

Model.prototype.buildController = function() {
    Model.prototype.buildComponent.call(this, 'controller');
}

Model.prototype.buildRoute = function() {
    Model.prototype.buildComponent.call(this, 'route');
};

Blocks.prototype.initModels = function() {
    this.models = this.config.models.map(function(model) {
        return new Model(model);
    });
}

Blocks.prototype.compose = function() {
    this.models.map((model) => {
        model.build();
    });
}


function main() {
    const blocks = new Blocks(config);

    blocks.initModels();
    blocks.compose();
}

main();

// console.log("blocks", blocks.models[0]);

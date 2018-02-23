const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');

function pipe(cpstd) {
    cpstd.stdout.pipe(process.stdout);
    cpstd.stderr.pipe(process.stderr);
}

function camelize(str) {
    return str.replace(/^([A-Z]+)([A-Z])/, function(match, $1, $2) {
        return match.replace($1, $1.toLowerCase());
    })
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
    const ast = esprima.parse(code);
    console.log('cleanUselessCode', ast);

    return code;
}

function compileFileSync(metaType, config) {
    if (metaType === 'Schema') {
        const tpl = fs.readFileSync(path.join(__dirname, 'tpls/model.tpl'));
        const targetContent = tpl.toString().replace(/{{(.*?)}}/gm, function(match, group) {
            // console.log('arguments', config.name);
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



Model.prototype.build = function() {
    if (this.force) {
        this.buildSchema();
        // this.buildRoute();
        // this.buildController();
    }
}

Model.prototype.buildSchema = function() {
    const {
        dest,
        name,
        properties,
    } = this.schema;

    const cpstd = cp.exec(`mkdir -p ${dest}`);
    pipe(cpstd);

    const fileName = `${dest}/${name}.js`;
    const fd = fs.openSync(fileName, 'w+');
    const content = compileFileSync('Schema', this.schema, this.schema);
    const cleanedContent = cleanUselessJSCode(content);
    fs.write(fd, `${cleanedContent}`, function(err, data) {
        if (err) throw err;
        console.log('data', data);
    });

}


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

const def = fs.readFileSync('./define/blocks.json');
const config = JSON.parse(def.toString());

const blocks = new Blocks(config);

blocks.initModels();
blocks.compose();

// console.log("blocks", blocks.models[0]);

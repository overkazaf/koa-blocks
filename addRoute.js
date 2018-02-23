const cp = require('child_process');
const fs = require('fs');
const esprima = require('esprima');

function Route(config, entity) {
    this.config = config;
    this.entity = entity;
}


Route.prototype.setup = function() {
    const mkdirCMD = 'mkdir -p';
    const config = this.config;
    console.log('Setup is in progress...');
    Object.keys(config).forEach(function(dir) {
        const cpstd = cp.exec(`${mkdirCMD} ${config[dir]}`);
        cpstd.stdout.pipe(process.stdout);
        cpstd.stderr.pipe(process.stderr);
    });

    this.install();
}

Route.prototype.install = function() {
    const code = fs.readFileSync('./entities/entity.def');
    const ast = esprima.parse(code.toString());
    console.log(ast);
}

Route.prototype.destory = function() {
    const rmCMD = 'rm -rf';
    const config = this.config;
    console.log('Destorying relevant files is in progress...');
    Object.keys(config).forEach(function(dir) {
        console.log('dir', dir);
        if (dir == 'indexDir') {
            return;
        } else {
            const cpstd = cp.exec(`${rmCMD} ${config[dir]}`);
            cpstd.stdout.pipe(process.stdout);
            cpstd.stderr.pipe(process.stderr);
        }
    });

    console.log('Destory task is done...');
}

function main() {
    const config = require('./conf.json');
    const route = new Route(config, process.argv[2]);
    route.setup();
    // route.destory();
}

main();
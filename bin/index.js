const chalk = require('chalk');
const program = require('commander');
const fs = require('fs');

let definition = null;

program
  .version('1.0.0')
  .option('-c, --config', 'Set config path')
  .action(function(p) {
  	console.log(p);
  	const fd = fs.readFileSync(p);
  	const content = fd.toString();
  	definition = content;
  })
  .parse(process.argv);
 
 console.log('definition', definition);
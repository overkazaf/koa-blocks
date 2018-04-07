const CMSAppJson = require('./models/CMSApp.json');
const StudentJson = require('./models/Student.json');
const ClazzJson = require('./models/Clazz.json');


const models = [
	CMSAppJson,
	StudentJson,
	ClazzJson,
];

const definition = {
	"cache": true,
	"cachePattern": "cacheAside",
	"basePath": "./",
	"models": models
};

module.exports = definition;

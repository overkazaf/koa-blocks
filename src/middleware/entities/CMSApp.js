const mongoose = require('mongoose');
const uuid = require('node-uuid');

const cmsAppSchema = new mongoose.Schema({
    _id: {
        type: 'String',
        default: function genUUID() {
            return uuid.v1();
        }
    },
	name: String,
	bundleId: String,
	version: String,
	savedPath: String,
	createor: String,
	appType: String,
	platform: String,
	publishedPath: String,
	createDate: Date,
	lastUpdateDate: Date,
});

mongoose.model('CMSApp', cmsAppSchema);
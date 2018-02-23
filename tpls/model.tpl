const mongoose = require('mongoose');
const uuid = require('node-uuid');

const {{schemaName}}Schema = new mongoose.Schema({
    {{SCHEMA_CONTENT}}
});

mongoose.model('{{SchemaName}}', {{schemaName}}Schema);
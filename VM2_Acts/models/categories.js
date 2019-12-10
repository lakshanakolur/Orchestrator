// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var catgoriesSchema = new mongoose.Schema({
    categoryname: { type: String, unique: true},
    noofacts: {type: Number}
});

var categories = mongoose.model('categories',catgoriesSchema);

module.exports = categories;
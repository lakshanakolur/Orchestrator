// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var actsSchema = new mongoose.Schema({
	actId: {type: Number, unique: true},
    username: { type: String},
   	timestamp: {type: Date, default: Date.now},
   	caption: {type: String},
   	categoryname: {type: String},
   	upvotes: {type: Number}, 
   	imgB64: {type: String}
});

var acts = mongoose.model('acts',actsSchema);

module.exports = acts;
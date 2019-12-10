// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var usersSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String, validate: /^[A-Fa-f0-9]{40}$/}
});

var users = mongoose.model('users',usersSchema);

module.exports = users;

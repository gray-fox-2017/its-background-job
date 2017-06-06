var mongoose = require('mongoose');
var Schema = mongoose.Schema

var UsersSchema = new Schema({
	name: {type:String, required:true},
	username: {type:String, required:true},
	password: {type:String, required:true},
	email: {type:String, required:true}
}, {timestamps:true})

var User = mongoose.model('Users', UsersSchema);

module.exports = User;

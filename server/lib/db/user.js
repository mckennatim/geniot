var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersSchema = new Schema({
	name: {type:String, index:{unique: true}},
	email: String,
	apikey: String,
	lists: Array,
	timestamp: String,
	role: String
}, { strict: false });

module.exports = mongoose.model('User', usersSchema);

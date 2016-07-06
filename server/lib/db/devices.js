var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var devicesSchema = new Schema({
	devid: {type:String, index:{unique: true}},
	domain: String,
	usersarr: Array,
	users: Array,
	loc: {
		lat: Number,
		lng: Number,
		timezone: String,
		address: String
	}
}, { strict: false });

module.exports = mongoose.model('Device', devicesSchema);

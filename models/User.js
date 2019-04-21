const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		min: [8, 'Username too short'],
		max: 32,
		unique: true,
		index: true,
		sparse: true
	},
	name: {
		type: String,
		required: true,
		min: [1, 'Name too shorst'],
		max: 32
	},
	password: {
		type: String,
		required: true,
		min: [8, 'Password too short'],
		max: 32
	},
	remotes: {
		type: Array,
		default: []
	},
	joinDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = User = mongoose.model('User', UserSchema, 'users');
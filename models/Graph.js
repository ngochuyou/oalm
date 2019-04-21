const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./User.js');

const GraphSchema = new Schema({
	vertices: {
		type: Array,
		require: true,
		sparse: true,
	},
	name: {
		type: String,
		require: true,
		sparse: true,
		default: 'untitled'
	},
	edges: {
		type: Array,
		require: true,
		sparse: true,
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	uId: {
		type: Schema.Types.ObjectId,
		require: true,
		sparse: true,
	}
});

module.exports = mongoose.model('Graph', GraphSchema, 'graphs');
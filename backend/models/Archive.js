const mongoose = require("mongoose");

const ArchiveSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	course_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "courseinfo",
		required: true,
	},
	team_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "team",
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	description: {
		type: Object,
		blackbox: true,
	},
	directory: {
		type: String,
		default: null,
	},
	size: {
		type: String,
		default: null,
	},
	tag: [
		{
			type: String,
			required: true,
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Archive = mongoose.model("archive", ArchiveSchema);

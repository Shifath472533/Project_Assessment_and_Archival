const mongoose = require("mongoose");

const CourseInfoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	semester: {
		type: String,
		required: true,
	},
	credit: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: Boolean,
		default: true,
	},
});

module.exports = CourseInfo = mongoose.model("courseinfo", CourseInfoSchema);

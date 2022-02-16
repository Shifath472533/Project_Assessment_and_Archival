const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	course_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "courseinfo",
		required: true,
	},
	teacher_id: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "teacher",
			required: true,
		},
	],
	teams_id: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "team",
		},
	],
	year: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
	initialized: {
		type: Boolean,
		default: false,
	},
	description: {
		type: Object,
		blackbox: true,
	},
	member_no: {
		max: {
			type: Number,
			default: 3,
		},
		min: {
			type: Number,
			default: 2,
		},
	},
	formation_date: {
		type: Date,
		default: Date.now,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Course = mongoose.model("course", CourseSchema);

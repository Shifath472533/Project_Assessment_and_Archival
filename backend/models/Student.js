const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	dob: {
		type: Date,
	},
	session: {
		type: String,
	},
	githubusername: {
		type: String,
		default: null,
	},
	taken_courses: [
		{
			course_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "course",
				required: true,
			},
			team_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "team",
				default: null,
			},
			mark: {
				type: Number,
				default: 0,
			},
		},
	],
	active: {
		type: Boolean,
		default: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Student = mongoose.model("student", StudentSchema);

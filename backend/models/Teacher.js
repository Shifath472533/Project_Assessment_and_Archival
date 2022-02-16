const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
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
	designation: {
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

module.exports = Teacher = mongoose.model("teacher", TeacherSchema);

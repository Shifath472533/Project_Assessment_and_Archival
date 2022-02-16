const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	course_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "course",
		required: true,
	},
	members_id: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
	],
	tasks_id: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "task",
		},
	],
	projectTitle: {
		type: String,
		default: null,
	},
	details: {
		type: Object,
		blackbox: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Team = mongoose.model("team", TeamSchema);

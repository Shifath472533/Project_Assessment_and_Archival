const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	team_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "team",
		required: true,
	},
	description: {
		type: Object,
		blackbox: true,
	},
	mark: {
		total: {
			type: Number,
		},
		accuired: {
			type: Number,
			default: 0,
		},
	},
	deadline: {
		type: Date,
	},
	directory: {
		type: String,
		default: null,
	},
	submission: {
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		time: {
			type: Date,
			default: Date.now,
		},
		directory: {
			type: String,
		},
		description: {
			type: Object,
			blackbox: true,
		},
	},
	comments: [
		{
			user_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "user",
			},
			comment: {
				type: String,
			},
			time: {
				type: Date,
				default: Date.now,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Task = mongoose.model("task", TaskSchema);

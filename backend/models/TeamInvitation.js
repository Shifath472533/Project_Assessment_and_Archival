const mongoose = require("mongoose");

const TeamInvitationSchema = new mongoose.Schema({
	team_name: {
		type: String,
	},
	from_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	to: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "user",
				required: true,
			},
			status: {
				type: Boolean,
				default: false,
			},
		},
	],
	course_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "course",
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = TeamInvitation = mongoose.model(
	"teaminvitation",
	TeamInvitationSchema
);

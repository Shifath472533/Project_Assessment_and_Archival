const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin", "office", "teacher", "student"],
		default: "user",
	},
	active: {
		type: Boolean,
		default: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = User = mongoose.model("user", UserSchema);

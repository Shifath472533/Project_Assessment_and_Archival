const mongoose = require("mongoose");

const OfficeSchema = new mongoose.Schema({
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
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Office = mongoose.model("office", OfficeSchema);

const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports.createUser = async function (userData) {
	let user = new User(userData);
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(userData.password, salt);
	await user.save();
	return user;
};

module.exports.getUserById = async function (id) {
	const userInfo = await User.findById(id);
	if (userInfo == null) {
		return null;
	}

	const user = {
		_id: userInfo._id,
		role: userInfo.role,
		username: userInfo.username,
	};
	return user;
};

var getUserByUsername = (module.exports.getUserByUsername = async function (
	username
) {
	const userInfo = await User.findOne({ username });
	return userInfo;
});

module.exports.activateUser = async function (username) {
	await User.findOneAndUpdate(
		{ username },
		{
			active: true,
		}
	);
	const userInfo = await getUserByUsername(username);
	return userInfo;
};

module.exports.deactivateUser = async function (username) {
	await User.findOneAndUpdate(
		{ username },
		{
			active: false,
		}
	);
};

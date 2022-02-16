const Office = require("../models/Office");

module.exports.getOfficeUser = async function (id) {
	const ofiiceUserInfo = await Office.findOne({ user: id });
	if (ofiiceUserInfo == null) {
		return null;
	}
	return ofiiceUserInfo;
};

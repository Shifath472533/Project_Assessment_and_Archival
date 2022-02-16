const jwt = require("jsonwebtoken");
const config = require("config");

function authUser(request, response, next) {
	const token = request.header("x-auth-token");

	if (!token) {
		console.log("authUser: Token Is Not Found!!!");
		return response
			.status(401)
			.json({ success: false, msg: "No token", data: null });
	}

	try {
		const decoded = jwt.verify(token, config.get("jwtToken"));
		request.user = decoded.user;
		console.log("authUser: Token Is Valid!!!");
		next();
	} catch (error) {
		console.log("authUser: Token Is Not Valid!!!");
		return response
			.status(401)
			.json({ success: false, msg: "Token is invalid", data: null });
	}
}

function roleUser(role) {
	return (request, response, next) => {
		if (request.user.role !== role) {
			console.log("roleUser: Role Is Invalid!!!");
			return response
				.status(401)
				.json({ success: false, msg: "Not Allowed", data: null });
		}
		console.log("roleUser: Role Is Valid!!!");
		next();
	};
}

module.exports = {
	authUser,
	roleUser,
};

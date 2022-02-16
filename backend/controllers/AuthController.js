const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const { serverError } = require("../services/functions");
const {
	getUserById,
	getUserByUsername,
	createUser,
} = require("../services/userQueries");

// @desc    Authenticated User's information
exports.getAuthenticatedUser = async (request, response) => {
	try {
		const user = await getUserById(request.user.id);
		if (user == null) {
			console.log("authenticatedUser: User Not Found!!!");
			return response.status(400).json({
				success: false,
				msg: "User not found.",
				data: null,
			});
		}

		console.log("authenticatedUser: User Found!!!");
		return response.status(200).json({
			success: true,
			msg: "User found successfully.",
			data: user,
		});
	} catch (error) {
		serverError(error, response);
	}
};

// @desc    Login User
exports.loginUser = async (request, response) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response
			.status(400)
			.json({ success: false, msg: errors.array(), data: null });
	}

	try {
		const { username, password } = request.body;

		const user = await getUserByUsername(username);
		if (!user) {
			console.log("loginUser: User Not Exist!!!");
			return response.status(400).json({
				success: false,
				msg: "User does not exist.",
				data: null,
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			console.log("loginUser: Password Doesn't Match!!!");
			return response.status(400).json({
				success: false,
				msg: "Username or Password is invalid.",
				data: null,
			});
		}

		const payload = {
			user: {
				id: user.id,
				role: user.role,
			},
		};

		jwt.sign(
			payload,
			config.get("jwtToken"),
			{ expiresIn: 3600000 },
			(error, token) => {
				if (error) throw error;
				console.log(
					"loginUser: Token Is Created, User Is Logged In!!!"
				);
				return response.json({
					success: true,
					msg: "Token created successfully.",
					data: token,
				});
			}
		);
	} catch (error) {
		serverError(error, response);
	}
};

// @desc    Register Office User
exports.registerUser = async (request, response) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response
			.status(400)
			.json({ success: false, msg: errors.array(), data: null });
	}

	const { username, password } = request.body;

	try {
		let userData = await User.findOne({ username });
		if (userData) {
			console.log("registerUser: User Already Exists!!!");
			return response.status(400).json({
				success: false,
				msg: "User already exists.",
				data: null,
			});
		}

		userData = new User({
			username,
			role: "ofiice",
			password,
		});

		const user = await createUser(userData);
		if (!user) {
			console.log("registerUser: Something Isn't Right!!!");
			return response.status(400).json({
				success: false,
				msg: "Something isn't right.",
				data: null,
			});
		}

		const payload = {
			user: {
				id: user.id,
				role: user.role,
			},
		};
		jwt.sign(
			payload,
			config.get("jwtToken"),
			{ expiresIn: 3600000 },
			(err, token) => {
				if (err) throw err;
				console.log(
					"registerUser: Token Is Created, User Is Created!!!"
				);
				return response.json({
					success: true,
					msg: "Token created successfully.",
					data: token,
				});
			}
		);
	} catch (error) {
		serverError(error, response);
	}
};

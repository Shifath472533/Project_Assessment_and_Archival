const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { authUser } = require("../../middleware/auth");

const AuthController = require("../../controllers/AuthController");

// @route   GET api/auth
// @desc    Authenticated User's information
// @access  Private
router.get("/", authUser, AuthController.getAuthenticatedUser);

// @route   POST api/user/login
// @desc    Login User
// @access  Public
router.post(
	"/login",
	[
		check("username", "Username is required").exists(),
		check("password", "Password is required").exists(),
	],
	AuthController.loginUser
);

// @route   POST api/auth/register
// @desc    Register User
// @access  Public
router.post(
	"/register",
	[
		check("username", "Username is required").not().isEmpty(),
		check(
			"password",
			"Please enter a valid password of 6 or more characters"
		).isLength({ min: 6 }),
	],
	AuthController.registerUser
);

module.exports = router;

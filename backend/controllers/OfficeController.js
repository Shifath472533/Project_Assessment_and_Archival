const { serverError, readCSVData } = require("../services/functions");
const { validationResult } = require("express-validator");
const { getOfficeUser } = require("../services/officeQueries");
const {
	getAllTeachersInfo,
	activateTeacherUser,
	createTeacher,
} = require("../services/teacherQueries");
const {
	getUserById,
	getUserByUsername,
	activateUser,
	createUser,
} = require("../services/userQueries");

// @desc    Get office user profile
exports.getOfficeUserProfile = async (req, res) => {
	try {
		const user = await getUserById(req.user.id);
		if (user == null) {
			console.log("getOfficeUserProfile: User Not Found!!!");
			return res.status(400).json({
				success: false,
				msg: "User not found.",
				data: null,
			});
		}
		const officeUser = await getOfficeUser(user._id);
		if (officeUser == null) {
			console.log("getOfficeUserProfile: Office User Not Found!!!");
			return res.status(400).json({
				success: false,
				msg: "Office user not found.",
				data: null,
			});
		}
		console.log("getOfficeUserProfile: Office User Found!!!");
		return res.status(200).json({
			success: true,
			msg: "Office user found successfully",
			data: officeUser,
		});
	} catch (error) {
		serverError(error, res);
	}
};

// @desc    Get all the teachers
exports.getAllTeachers = async (req, res) => {
	try {
		const teachers = await getAllTeachersInfo();
		if (teachers == null) {
			console.log("getAllTeachers: Teachers Not Found!!!");
			return res.status(400).json({
				success: false,
				msg: "Teachers not found.",
				data: null,
			});
		}
		console.log("getAllTeachers: Teachers Found!!!");
		return res.status(200).json({
			success: true,
			msg: "Teacher users found successfully",
			data: teachers,
		});
	} catch (error) {
		serverError(error, res);
	}
};

// @desc    Add a Teacher
exports.addTeacher = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("addTeacher: Validation Error!!!");
		return res
			.status(400)
			.json({ success: false, msg: errors.array(), data: null });
	}

	try {
		const { username, name, designation, dob, email, githubusername } =
			req.body;

		// User exist
		let user, teacher;
		user = await getUserByUsername(username);
		if (user) {
			if (user.active) {
				console.log("addTeacher: User Is Active!!!");
				return res.status(400).json({
					success: false,
					msg: "User already exists.",
					data: null,
				});
			}

			user = await activateUser(username);
			console.log("addTeacher: User Is Activated!!!");
			teacher = await activateTeacherUser(name, email, dob);
			console.log("addTeacher: Teacher Is Activated!!!");

			return res.status(200).json({
				success: true,
				msg: "User and teacher found and activated.",
				data: { user, teacher },
			});
		}

		const userData = {
			username: username,
			role: "teacher",
			password: "12345678",
		};
		user = await createUser(userData);
		console.log("addTeacher: User Is Created!!!");

		const teacherData = {
			user: user._id,
			name: name,
			dob: dob,
			email: email,
			designation: designation,
			githubusername: githubusername,
		};
		teacher = await createTeacher(teacherData);
		console.log("addTeacher: Teacher Is Created!!!");

		return res.status(200).json({
			success: true,
			msg: "User and teacher created",
			data: { user, teacher },
		});
	} catch (error) {
		serverError(error, res);
	}
};

// @desc    Add a Teacher using CSV
exports.addTeacherUsingCSV = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("addTeacherUsingCSV: Validation Error!!!");
		return res
			.status(400)
			.json({ success: false, msg: errors.array(), data: null });
	}

	try {
		const teachers = await readCSVData(req.file.path);
		console.log("addTeacherUsingCSV: File Is Uploaded And Read!!!");

		for (const item in teachers) {
			let user, teacher;
			user = await getUserByUsername(teachers[item].username);
			if (user) {
				if (user.active) {
					console.log("addTeacherUsingCSV: User Is Active!!!");
					return res.status(400).json({
						success: false,
						msg: "User already exists.",
						data: null,
					});
				}
				user = await activateUser(teachers[item].username);
				console.log("addTeacherUsingCSV: User Is Activated!!!");
				teacher = await activateTeacherUser(
					teachers[item].name,
					teachers[item].email,
					teachers[item].dob
				);
				console.log("addTeacherUsingCSV: Teacher Is Activated!!!");

				return res.status(200).json({
					success: true,
					msg: "User and teacher found and activated.",
					data: { user, teacher },
				});
			}
			const userData = {
				username: teachers[item].username,
				role: "teacher",
				password: "12345678",
			};
			user = await createUser(userData);
			console.log("addTeacherUsingCSV: User Is Created!!!");

			const teacherData = {
				user: user._id,
				name: teachers[item].name,
				dob: teachers[item].dob,
				email: teachers[item].email,
				designation: teachers[item].designation,
				githubusername: teachers[item].githubusername,
			};

			teacher = await createTeacher(teacherData);
			console.log("addTeacherUsingCSV: Teacher Is Created!!!");
		}

		return res.status(200).json({
			success: true,
			msg: "All user and teacher created",
			data: null,
		});
	} catch (error) {
		serverError(error, res);
	}
};

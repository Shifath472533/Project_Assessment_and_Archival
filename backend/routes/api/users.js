const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Office = require("../../models/Office");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const { authUser, roleUser } = require("../../middleware/auth");
const { getStudentUser } = require("../../services/studentQueries");
const {
	getMainCourse,
	getAssignedCourse,
} = require("../../services/assignedCourseQueries");
const { getTeacherUser2 } = require("../../services/teacherQueries");

// @route   GET api/users/profile
// @desc    Authenticated User's profile
// @access  Private
router.get("/profile", authUser, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("role");
		if (user.role == "office") {
			const office = await Office.findOne({ user: user._id });
			return res
				.status(200)
				.json({ success: true, msg: "Profile found", data: office });
		} else if (user.role == "teacher") {
			const teacher = await Teacher.findOne({ user: user._id }).select(
				"-taken_course_id"
			);
			return res
				.status(200)
				.json({ success: true, msg: "Profile found", data: teacher });
		} else {
			const student = await Student.findOne({ user: user._id }).select(
				"-taken_course"
			);
			return res
				.status(200)
				.json({ success: true, msg: "Profile found", data: student });
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ success: false, msg: "Server Error.." });
	}
});

// @route   Post api/users/profile
// @desc    Update logged in User's profile
// @access  Private
router.post(
	"/profile",
	[
		authUser,
		check("name", "Name is required").not().isEmpty(),
		check("email", "Email is required").not().isEmpty(),
		check("dob", "Date of birth is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select("role");
			if (user.role == "office") {
				const { name, email, dob } = req.body;
				const office = await Office.findOneAndUpdate(
					{ user: user._id },
					{
						$set: {
							name: name,
							email: email,
							dob: dob,
						},
					}
				);
				return res.status(200).json({
					success: true,
					msg: "Profile found",
					data: office,
				});
			} else if (user.role == "teacher") {
				const { name, email, dob, githubusrename } = req.body;
				const teacher = await Teacher.findOneAndUpdate(
					{ user: user._id },
					{
						$set: {
							name: name,
							email: email,
							dob: dob,
							githubusrename: githubusrename,
						},
					}
				);
				return res.status(200).json({
					success: true,
					msg: "Profile found",
					data: teacher,
				});
			} else {
				const { name, email, dob, githubusrename } = req.body;
				const student = await Student.findOneAndUpdate(
					{ user: user._id },
					{
						$set: {
							name: name,
							email: email,
							dob: dob,
							githubusrename: githubusrename,
						},
					}
				);
				return res.status(200).json({
					success: true,
					msg: "Profile found",
					data: student,
				});
			}
		} catch (error) {
			console.error(error.message);
			return res
				.status(500)
				.json({ success: false, msg: "Server Error.." });
		}
	}
);

// @route   GET api/users/student/profile/:user_id
// @desc    Student User's profile
// @access  Private
router.get(
	"/student/profile/:user_id",
	[authUser, roleUser("office")],
	async (req, res) => {
		try {
			const user = req.params.user_id;
			var student = await getStudentUser(user);
			var takenCourses = [];
			const takenCourse = student.taken_courses;
			for (const course in takenCourse) {
				const takenCourseInfo = await getAssignedCourse(
					takenCourse[course].course_id
				);
				const mainCourseInfo = await getMainCourse(
					takenCourse[course].course_id
				);
				console.log(mainCourseInfo.title);
				let courseInfo = {
					title: mainCourseInfo.title,
					code: mainCourseInfo.code,
					year: takenCourseInfo.year,
				};
				takenCourses.push(courseInfo);
			}
			return res.status(200).json({
				success: true,
				msg: "Profile found",
				data: [{ student: student, takenCourses: takenCourses }],
			});
		} catch (error) {
			console.error(error.message);
			return res
				.status(500)
				.json({ success: false, msg: "Server Error.." });
		}
	}
);

// @route   GET api/users/teacher/profile/:user_id
// @desc    Teacher User's profile
// @access  Private
router.get(
	"/teacher/profile/:user_id",
	[authUser, roleUser("office")],
	async (req, res) => {
		try {
			const user = req.params.user_id;
			var teacher = await getTeacherUser2(user);
			/* console.log(teacher); */
			var takenCourses = [];
			const takenCourse = teacher.taken_courses;
			for (const course in takenCourse) {
				const takenCourseInfo = await getAssignedCourse(
					takenCourse[course].course_id
				);
				const mainCourseInfo = await getMainCourse(
					takenCourse[course].course_id
				);
				/* console.log(mainCourseInfo.title); */
				let courseInfo = {
					title: mainCourseInfo.title,
					code: mainCourseInfo.code,
					year: takenCourseInfo.year,
				};
				takenCourses.push(courseInfo);
			}
			return res.status(200).json({
				success: true,
				msg: "Profile found",
				data: [{ teacher: teacher, takenCourses: takenCourses }],
			});
		} catch (error) {
			console.error(error.message);
			return res
				.status(500)
				.json({ success: false, msg: "Server Error.." });
		}
	}
);

router.get("/test", async (req, res) => {
	return res.json({ msg: "ok" });
});

module.exports = router;

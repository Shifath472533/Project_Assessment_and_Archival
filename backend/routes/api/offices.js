const express = require("express");
const router = express.Router();

const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const path = "./uploads";
		fs.mkdirSync(path, { recursive: true });
		cb(null, path);
	},
	filename: function (req, file, cb) {
		const dt = new Date();
		const uniqueSuffix =
			dt.getFullYear().toString() +
			dt.getMonth().toString() +
			dt.getDate().toString() +
			dt.getHours().toString() +
			dt.getMinutes().toString() +
			dt.getSeconds().toString() +
			"_";
		cb(null, uniqueSuffix + file.originalname);
	},
});
const upload = multer({ storage: storage });

const { check, validationResult } = require("express-validator");
const { authUser, roleUser } = require("../../middleware/auth");
const { serverError, readCSVData } = require("../../services/functions");
const {
	createUser,
	getUserById,
	activateUser,
	getUserByUsername,
	deactivateUser,
} = require("../../services/userQueries");
const { getOfficeUser } = require("../../services/officeQueries");
const {
	createTeacher,
	getAllTeacherUser,
	activateTeacherUser,
	deactivateTeacherUser,
	addCourseToTeacher,
	removeCourseFromTeacher,
	updateTeacher,
	getTeacherUser,
} = require("../../services/teacherQueries");
const {
	getAllStudentUser,
	createStudent,
	activateStudentUser,
	deactivateStudentUser,
	findRegisteredCourse,
	registerStudentInCourse,
	unregisterStudentInCourse,
	updateStudent,
} = require("../../services/studentQueries");
const {
	findCourse,
	removeCourse,
	updateCourse,
	getAllCourse,
	getCourse,
	createCourse,
	getSemesterBasedCourse,
} = require("../../services/courseQueries");
const {
	findAssignedCourse,
	createAssignedCourse,
	deleteAssignedCourse,
	getRunningCourse,
	findAssignedCourseTeacher,
	addTeacherAssignedCourse,
} = require("../../services/assignedCourseQueries");
const OfficeController = require("../../controllers/OfficeController");

// @route   GET api/offices/profile
// @desc    Get office profile
// @access  Private
router.get(
	"/profile",
	[authUser, roleUser("office")],
	OfficeController.getOfficeUserProfile
);

// @route   GET api/offices/teacher
// @desc    Get all the Teachers
// @access  Private
router.get(
	"/teacher",
	[authUser, roleUser("office")],
	OfficeController.getAllTeachers
);

// @route   POST api/offices/teacher/add
// @desc    Add a Teacher
// @access  Private
router.post(
	"/teacher/add",
	[
		authUser,
		roleUser("office"),
		check("username", "Username is required!!!").not().isEmpty(),
		check("name", "Name is required!!!").not().isEmpty(),
		check("email", "Email address is required!!!")
			.not()
			.isEmpty()
			.isEmail(),
		check("designation", "Designation is required!!!").not().isEmpty(),
		check("dob", "Date of birth is required!!!").not().isEmpty().isDate(),
	],
	OfficeController.addTeacher
);

// @route   POST api/offices/teacher/addCSV
// @desc    Add a Teacher using CSV
// @access  Private
router.post(
	"/teacher/addCSV",
	[authUser, roleUser("office"), upload.single("file")],
	OfficeController.addTeacherUsingCSV
);

// @route   POST api/offices/teacher/update
// @desc    Update a Teacher
// @access  Private
router.post(
	"/teacher/update",
	[
		authUser,
		roleUser("office"),
		check("username", "Teacher's username is required").not().isEmpty(),
		check("name", "Teacher's name is required").not().isEmpty(),
		check("email", "Teacher's email is required").not().isEmpty().isEmail(),
		check("designation", "Teacher's designation is required")
			.not()
			.isEmpty(),
		check("dob", "Teacher's date of birth is required")
			.not()
			.isEmpty()
			.isDate(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}

		try {
			const { username, name, designation, dob, email, githubusername } =
				req.body;

			const user = await getUserByUsername(username);

			const teacherData = {
				name: name,
				dob: dob,
				email: email,
				designation: designation,
				githubusername: githubusername,
			};

			const teacher = await updateTeacher(user._id, teacherData);

			return res.status(200).json({
				success: true,
				msg: "Teacher updated",
				data: teacher,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   DELETE api/offices/teacher/delete
// @desc    Deactivate a Teacher
// @access  Private
router.delete(
	"/teacher/delete",
	[
		authUser,
		roleUser("office"),
		check("_id", "Teacher's id is required").not().isEmpty(),
		check("username", "Teacher's username is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { _id, username } = req.body;
			const teacherUser = await getUserByUsername(username);
			if (!teacherUser) {
				return res.status(400).json({
					success: false,
					msg: "Teacher not found.",
					data: null,
				});
			}
			await deactivateUser(username);
			await deactivateTeacherUser(_id);

			return res.status(200).json({
				success: true,
				msg: "Teacher is deactivated.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/teacher/assign_course
// @desc    Assign Teacher in Course
// @access  Private
router.post(
	"/teacher/assign_course",
	[
		authUser,
		roleUser("office"),
		check("course_id", "Course id is required").not().isEmpty(),
		check("teacher_id", "Teacher's id is required").not().isEmpty(),
		check("year", "Course year is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { course_id, teacher_id, year } = req.body;

			const assignedCourse = await findAssignedCourse(course_id, year);

			if (assignedCourse) {
				const teacherIds = assignedCourse.teacher_id;
				for (const eachId of teacherIds) {
					console.log(eachId);
					if (eachId == teacher_id) {
						return res.status(400).json({
							success: false,
							msg: "Teacher is already assigned to this course in this year.",
							data: null,
						});
					}
				}

				await addTeacherAssignedCourse(assignedCourse._id, teacher_id);
				await addCourseToTeacher(teacher_id, assignedCourse._id);
				return res.status(200).json({
					success: true,
					msg: "Teacher is assigned to this course successfully.",
					data: null,
				});
			}

			const assignedCourseId = await createAssignedCourse(
				course_id,
				[teacher_id],
				year
			);

			await addCourseToTeacher(teacher_id, assignedCourseId);

			return res.status(200).json({
				success: true,
				msg: "Teacher is assigned to this course successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/teacher/usassign_course
// @desc    Unassign Teacher in Course
// @access  Private
router.post(
	"/teacher/unassign_course",
	[
		authUser,
		roleUser("office"),
		check("course_id", "Course Code is required").not().isEmpty(),
		check("teacher_id", "Teacher username is required").not().isEmpty(),
		check("year", "Specific session is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { course_id, teacher_id, year } = req.body;

			const assignedCourse = await findAssignedCourseTeacher(
				course_id,
				teacher_id,
				year
			);
			/* console.log(true); */
			if (!assignedCourse) {
				return res.status(400).json({
					success: false,
					msg: "Teacher is not assigned to this course in this year.",
					data: null,
				});
			}

			await removeCourseFromTeacher(teacher_id, assignedCourse._id);

			await deleteAssignedCourse(assignedCourse._id);

			return res.status(200).json({
				success: true,
				msg: "Course has been removed from teacher and deleted successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/offices/courses
// @desc    Get all the Courses
// @access  Private
router.get("/courses", [authUser, roleUser("office")], async (req, res) => {
	try {
		const courses = await getAllCourse();
		if (courses == null) {
			return res.status(400).json({
				success: false,
				msg: "Courses not found.",
				data: null,
			});
		}
		return res.status(200).json({
			success: true,
			msg: "Courses found successfully",
			data: courses,
		});
	} catch (error) {
		serverError(error, res);
	}
});

// @route   GET api/offices/running_courses/:year
// @desc    Get all the running Courses
// @access  Private
router.get(
	"/running_courses",
	[authUser, roleUser("office")],
	async (req, res) => {
		try {
			//const year = req.params.year;
			const runningCourses = await getRunningCourse();
			var courses = [];
			for (const eachCourse of runningCourses) {
				const courseDetails = await getCourse(eachCourse.course_id);
				const teacherIds = eachCourse.teacher_id;
				var teacherDetails = [];
				var userDetails = [];
				for (const eachId of teacherIds) {
					const teacher = await getTeacherUser(eachId);
					teacherDetails.push(teacher);
					const user = await getUserById(teacher.user);
					userDetails.push(user);
				}

				const course = {
					courseDetails,
					eachCourse,
					teacherDetails,
					userDetails,
				};
				courses.push(course);
			}
			if (runningCourses == null) {
				return res.status(400).json({
					success: false,
					msg: "Courses not found.",
					data: null,
				});
			}
			return res.status(200).json({
				success: true,
				msg: "Courses found successfully",
				data: courses,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/offices/course/:code
// @desc    Get a specific Course using code
// @access  Private
router.get(
	"/course/:code",
	[authUser, roleUser("office")],
	async (req, res) => {
		try {
			const code = req.params.code;
			const course = await findCourse(code);
			if (course == null) {
				return res.status(400).json({
					success: false,
					msg: "Course not found.",
					data: null,
				});
			}
			return res.status(200).json({
				success: true,
				msg: "Course found successfully",
				data: course,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/offices/courseSemester/:semester
// @desc    Get a specific Course using semester
// @access  Private
router.get(
	"/courseSemester/:semester",
	[authUser, roleUser("office")],
	async (req, res) => {
		try {
			const semester = req.params.semester;
			const courses = await getSemesterBasedCourse(semester);
			if (courses == null) {
				return res.status(400).json({
					success: false,
					msg: "Course not found.",
					data: null,
				});
			}
			return res.status(200).json({
				success: true,
				msg: "Course found successfully",
				data: courses,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/course/add
// @desc    Add Course
// @access  Private
router.post(
	"/course/add",
	[
		authUser,
		roleUser("office"),
		check("title", "Course title is required").not().isEmpty(),
		check("code", "Course code is required").not().isEmpty(),
		check("credit", "Course credit is required").not().isEmpty(),
		check("semester", "Course semester is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			const { title, code, credit, semester, description } = req.body;
			const course = await findCourse(code);
			if (course) {
				if (course.status) {
					return res.status(400).json({
						success: false,
						msg: "Course already exists.",
						data: null,
					});
				} else {
					return res.status(400).json({
						success: false,
						msg: "Course found but deactivated.",
						data: null,
					});
				}
			}

			await createCourse(title, code, credit, semester, description);

			return res.status(200).json({
				success: true,
				msg: "Course added successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   DELETE api/offices/course/remove
// @desc    Delete Course
// @access  Private
router.delete(
	"/course/remove",
	[
		authUser,
		roleUser("office"),
		check("code", "Course code is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const { code } = req.body;
			const course = await findCourse(code);
			if (!course) {
				return res.status(400).json({
					success: false,
					msg: "Course not found",
					data: null,
				});
			}

			await removeCourse(code);
			return res.status(200).json({
				success: true,
				msg: "Course removed successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/course/update
// @desc    Update Course
// @access  Private
router.post(
	"/course/update",
	[
		authUser,
		roleUser("office"),
		check("title", "Course title is required").not().isEmpty(),
		check("code", "Course code is required").not().isEmpty(),
		check("credit", "Course credit is required").not().isEmpty(),
		check("semester", "Course semester is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const { title, code, semester, credit, description } = req.body;
			const course = await findCourse(code);

			if (!course) {
				return res.status(400).json({
					success: false,
					msg: "Course not found.",
					data: null,
				});
			}

			await updateCourse(title, code, credit, semester, description);

			return res.status(200).json({
				success: true,
				msg: "Course updated successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/offices/student/:session
// @desc    Get all the students of a session
// @access  Private
router.get(
	"/student/:session",
	[authUser, roleUser("office")],
	async (req, res) => {
		try {
			const session = req.params.session;
			const students = await getAllStudentUser(session);
			if (students == null) {
				return res.status(400).json({
					success: false,
					msg: "Students not found.",
					data: null,
				});
			}
			return res.status(200).json({
				success: true,
				msg: "Students found successfully",
				data: students,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/student/add
// @desc    Add Student
// @access  Private
router.post(
	"/student/add",
	[
		authUser,
		roleUser("office"),
		check("username", "Student's username is required").not().isEmpty(),
		check("name", "Student's name is required").not().isEmpty(),
		check("email", "Student's email is required").not().isEmpty(),
		check("session", "Student's session is required").not().isEmpty(),
		check("dob", "Student's date of birth is required")
			.not()
			.isEmpty()
			.isDate(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { username, name, session, dob, email, githubusername } =
				req.body;

			// User exist
			let user, student;
			user = await getUserByUsername(username);
			if (user) {
				if (user.active) {
					return res.status(400).json({
						success: false,
						msg: "User already exists.",
						data: null,
					});
				}

				user = await activateUser(username);

				student = await activateStudentUser(name, email, dob);

				return res.status(200).json({
					success: true,
					msg: "User and student found and activated.",
					data: { user, teacher },
				});
			}

			const userData = {
				username: username,
				role: "student",
				password: "12345678",
			};
			user = await createUser(userData);

			const studentData = {
				user: user._id,
				name: name,
				dob: dob,
				email: email,
				session: session,
				githubusername: githubusername,
			};

			student = await createStudent(studentData);

			return res.status(200).json({
				success: true,
				msg: "User and student created",
				data: { user, student },
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/student/addCSV
// @desc    Add Student
// @access  Private
router.post(
	"/student/addCSV",
	[authUser, roleUser("office"), upload.single("file")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}

		try {
			console.log("The file: ", req.file.path);
			const students = await readCSVData(req.file.path);

			for (const item in students) {
				// User exist
				let user, teacher;
				user = await getUserByUsername(students[item].username);
				if (user) {
					if (user.active) {
						return res.status(400).json({
							success: false,
							msg: "User already exists.",
							data: null,
						});
					}
					user = await activateUser(students[item].username);

					teacher = await activateStudentUser(
						students[item].name,
						students[item].email,
						students[item].dob
					);

					return res.status(200).json({
						success: true,
						msg: "User and student found and activated.",
						data: { user, teacher },
					});
				}
				const userData = {
					username: students[item].username,
					role: "student",
					password: "12345678",
				};
				user = await createUser(userData);

				const studentData = {
					user: user._id,
					name: students[item].name,
					dob: students[item].dob,
					email: students[item].email,
					session: students[item].session,
					githubusername: students[item].githubusername,
				};

				student = await createStudent(studentData);
			}

			return res.status(200).json({
				success: true,
				msg: "User and student created",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/student/update
// @desc    Update Student
// @access  Private
router.post(
	"/student/update",
	[
		authUser,
		roleUser("office"),
		check("username", "Student's username is required").not().isEmpty(),
		check("name", "Student's name is required").not().isEmpty(),
		check("email", "Student's email is required").not().isEmpty(),
		check("dob", "Student's date of birth is required")
			.not()
			.isEmpty()
			.isDate(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { username, name, dob, email, githubusername } = req.body;

			const user = await getUserByUsername(username);

			const studentData = {
				name: name,
				dob: dob,
				email: email,
				githubusername: githubusername,
			};

			await updateStudent(user._id, studentData);

			return res.status(200).json({
				success: true,
				msg: "Student updated",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   DELETE api/offices/student/delete/
// @desc    Delete Student
// @access  Private
router.delete(
	"/student/delete",
	[
		authUser,
		roleUser("office"),
		check("_id", "Student's id is required").not().isEmpty(),
		check("username", "Student username is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { _id, username } = req.body;
			const studentUser = await getUserByUsername(username);
			if (!studentUser) {
				return res.status(400).json({
					success: false,
					msg: "User not found.",
					data: null,
				});
			}
			await deactivateUser(username);
			await deactivateStudentUser(_id);

			return res.status(200).json({
				success: true,
				msg: "Student is deactivated.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/student/register_course
// @desc    Register Student in Course
// @access  Private
router.post(
	"/student/register_course",
	[
		authUser,
		roleUser("office"),
		check("course_id", "Course id is required").not().isEmpty(),
		check("username", "Student's registration number is required")
			.not()
			.isEmpty(),
		check("year", "Course registration year is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { course_id, username, year } = req.body;

			const studentUser = await getUserByUsername(username);

			if (!studentUser) {
				return res.status(400).json({
					success: false,
					msg: "User not found",
					data: null,
				});
			}

			//const courseInfo = await findCourse(course_code);
			const assignedCourse = await findAssignedCourse(course_id, year);

			if (assignedCourse) {
				const registeredCourse = await findRegisteredCourse(
					studentUser._id,
					assignedCourse._id
				);

				if (registeredCourse) {
					return res.status(400).json({
						success: false,
						msg: "Student is already registered to this course in this year.",
						data: null,
					});
				}

				await registerStudentInCourse(
					studentUser._id,
					assignedCourse._id
				);
			}

			return res.status(200).json({
				success: true,
				msg: "Student has been registered successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/student/register_courseCSV
// @desc    Register Student in Course
// @access  Private
router.post(
	"/student/register_courseCSV",
	[authUser, roleUser("office"), upload.single("file")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			console.log("The file: ", req.file.path);
			const students = await readCSVData(req.file.path);

			for (const item in students) {
				const studentUser = await getUserByUsername(
					students[item].username
				);

				if (!studentUser) {
					return res.status(400).json({
						success: false,
						msg: "User not found",
						data: null,
					});
				}

				const courseInfo = await findCourse(students[item].course_code);
				const assignedCourse = await findAssignedCourse(
					courseInfo._id,
					students[item].year
				);

				if (assignedCourse) {
					const registeredCourse = await findRegisteredCourse(
						studentUser._id,
						assignedCourse._id
					);

					if (registeredCourse) {
						return res.status(400).json({
							success: false,
							msg: "Student is already registered to this course in this year.",
							data: null,
						});
					}

					await registerStudentInCourse(
						studentUser._id,
						assignedCourse._id
					);
				}
			}

			return res.status(200).json({
				success: true,
				msg: "Student has been registered successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/offices/student/unregister_course
// @desc    Unregister Student in Course
// @access  Private
router.post(
	"/student/unregister_course",
	[
		authUser,
		roleUser("office"),
		check("assigned_course_id", "Course id is required").not().isEmpty(),
		check("student_username", "Student's registration number is required")
			.not()
			.isEmpty(),
		check("year", "Course registration year is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { assigned_course_id, student_username, year } = req.body;

			const studentUser = await getUserByUsername(student_username);

			if (!studentUser) {
				return res.status(400).json({
					success: false,
					msg: "User not found",
					data: null,
				});
			}

			const registeredCourse = await findRegisteredCourse(
				studentUser._id,
				assigned_course_id
			);

			if (!registeredCourse) {
				return res.status(400).json({
					success: false,
					msg: "Student is not registered to this course in this year.",
					data: null,
				});
			}

			await unregisterStudentInCourse(
				studentUser._id,
				assigned_course_id
			);

			return res.status(200).json({
				success: true,
				msg: "Student has been unregistered successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

module.exports = router;

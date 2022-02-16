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
	getStudentTakenCoursesActive,
	getStudentTakenCoursesInactive,
	getTeamIdOfTakenCourse,
} = require("../../services/studentQueries");
const {
	gotAnyInvitaion,
	didInviteAnyone,
	createNewInvitation,
	addNewInvitation,
	acceptInvitationStudent,
	declineInvitationStudent,
} = require("../../services/teamInvitationQueries");
const {
	getTheTasksOfTeam,
	getTheDetailsOfTeam,
	findTeam,
	updateTeam,
} = require("../../services/teamQueries");
const {
	submitTaskFile,
	addComment,
	getTaskDetails,
	submitTaskDetails,
} = require("../../services/taskQueries");
const { getAssignedCourse } = require("../../services/assignedCourseQueries");
const Task = require("../../models/Task");

// @route   GET api/students/courses
// @desc    Get all the courses
// @access  Private
router.get("/courses", [authUser, roleUser("student")], async (req, res) => {
	try {
		const user = req.user.id;
		const activeCourses = await getStudentTakenCoursesActive(user);
		const inactiveCourses = await getStudentTakenCoursesInactive(user);

		activeCourses.sort((a, b) =>
			a.year < b.year ? 1 : b.year < a.year ? -1 : 0
		);
		inactiveCourses.sort((a, b) =>
			a.year < b.year ? 1 : b.year < a.year ? -1 : 0
		);

		return res.status(200).json({
			success: true,
			msg: "Found the courses",
			data: {
				Active_Courses: activeCourses,
				Inactive_Courses: inactiveCourses,
			},
		});
	} catch (error) {
		serverError(error, res);
	}
});

// @route   GET api/students/:registered_course_id
// @desc    Get tasks of a course
// @access  Private
router.get(
	"/:registered_course_id",
	[authUser, roleUser("student")],
	async (req, res) => {
		try {
			const user = req.user.id;
			const takenCourseId = req.params.registered_course_id;

			const team = await findTeam(user, takenCourseId);
			if (!team) {
				return res.status(200).json({
					success: true,
					msg: "Team not found.",
					data: null,
				});
			}
			/* if (!team) {
				const msgTeam = "No team found.";

				const invitation = await gotAnyInvitaion(user, takenCourseId);

				if (!invitation) {
					const msgInvitation = "No invitation found.";

					const invited = await didInviteAnyone();

					if (!invited) {
						const msgInvited = "Did not invite anyone.";
						return res.status(200).json({
							success: true,
							msg: {
								team: msgTeam,
								invitation: msgInvitation,
								invited: msgInvited,
							},
							data: null,
						});
					}
					const invited_to = invited.to;
					return res.status(200).json({
						success: true,
						msg: { team: msgTeam, invitation: msgInvitation },
						data: invited_to,
					});
				}
				return res.status(200).json({
					success: true,
					msg: { team: msgTeam },
					data: invitation,
				});
			} */

			const tasks = await getTheTasksOfTeam(team._id);
			tasks.sort((a, b) =>
				a.date < b.date ? 1 : b.date < a.date ? -1 : 0
			);
			if (!tasks.length) {
				return res.status(200).json({
					success: true,
					msg: "Task not found.",
					data: null,
				});
			}
			return res.status(200).json({
				success: true,
				msg: "Task found.",
				data: tasks,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/students/team/:registered_course_id
// @desc    Get the team of a course
// @access  Private
router.get(
	"/team/:registered_course_id",
	[authUser, roleUser("student")],
	async (req, res) => {
		try {
			const user = req.user.id;
			const takenCourseId = req.params.registered_course_id;
			if (!takenCourseId)
				return res.status(200).json({
					success: false,
					msg: "Error",
					data: null,
				});

			const teamInfo = await findTeam(user, takenCourseId);
			if (!teamInfo)
				return res.status(200).json({
					success: false,
					msg: "Error",
					data: null,
				});

			const { team, userInfo, studentInfo } = await getTheDetailsOfTeam(
				teamInfo._id
			);

			return res.status(200).json({
				success: true,
				msg: "Found the team.",
				data: {
					team: team,
					userInfo: userInfo,
					studentInfo: studentInfo,
				},
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/students/invitation/:registered_course_id
// @desc    Post member reg and team name of a team
// @access  Private
router.post(
	"/invitation/:registered_course_id",
	[
		authUser,
		roleUser("student"),
		check("invited_students", "Registration number is required")
			.not()
			.isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const user = req.user.id;
			const takenCourseId = req.params.registered_course_id;
			const { team_name, invited_students } = req.body;
			const invited_students_reg = invited_students
				.split(",")
				.map((invited_student) => invited_student.trim());
			const invited = await didInviteAnyone(user, takenCourseId);

			if (!invited) {
				await createNewInvitation(
					user,
					takenCourseId,
					team_name,
					invited_students_reg
				);

				return res.status(200).json({
					success: true,
					msg: "New invitation created successfully.",
					data: null,
				});
			}

			await addNewInvitation(
				user,
				takenCourseId,
				team_name,
				invited_students_reg
			);

			return res.status(200).json({
				success: true,
				msg: "Invited successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   PUT api/students/invited/:registered_course_id/:decision
// @desc    Put the decision of weather to accept or decline an invitation
// @access  Private
router.put(
	"/invited/:registered_course_id/:decision",
	[authUser, roleUser("student")],
	async (req, res) => {
		try {
			const user = req.user.id;
			const takenCourseId = req.params.registered_course_id;
			const decision = req.params.decision;

			if (decision == "accept") {
				await acceptInvitationStudent(user, takenCourseId);
				return res.status(200).json({
					success: true,
					msg: "Invitation accepted successfully.",
					data: null,
				});
			}

			await declineInvitationStudent(user, takenCourseId);
			return res.status(200).json({
				success: true,
				msg: "Invitation declined successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/students/task/:taskId
// @desc    Get the specific task
// @access  Private
router.get(
	"/task/:taskId",
	[authUser, roleUser("student")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const taskId = req.params.taskId;

			const taskDetails = await getTaskDetails(taskId);
			//console.log(taskDetails);
			if (taskDetails) {
				return res.status(200).json({
					success: true,
					msg: "Task found successfully",
					data: {
						task: taskDetails.task,
						comment: taskDetails.commentList,
					},
				});
			}
			return res.status(200).json({
				success: false,
				msg: "Task not found",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/students/specificCourse/:courseId
// @desc    Get the specific course
// @access  Private
router.get(
	"/specificCourse/:courseId",
	[authUser, roleUser("student")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const courseId = req.params.courseId;

			const courseInfo = await getAssignedCourse(courseId);

			if (courseInfo) {
				return res.status(200).json({
					success: true,
					msg: "Course found successfully",
					data: courseInfo,
				});
			}
			return res.status(200).json({
				success: false,
				msg: "Course not found",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/students/submitFile/:taskId
// @desc    Submit the task file
// @access  Private
router.post(
	"/submitFile/:taskId",
	[authUser, roleUser("student"), upload.single("file")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			console.log("The file: ", req.file.path);
			/* const file = await readCSVData(req.file.path); */
			const user = req.user.id;
			const taskId = req.params.taskId;
			const directory = req.file.path.toString().split("/");
			await submitTaskFile(taskId, user, directory[1]);

			return res.status(200).json({
				success: true,
				msg: "File submitted successfully",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/students/submit/:taskId
// @desc    Submit the task
// @access  Private
router.post(
	"/submit/:taskId",
	[authUser, roleUser("student")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			/* const file = await readCSVData(req.file.path); */
			const user = req.user.id;
			const taskId = req.params.taskId;
			const { description } = req.body;
			await submitTaskDetails(taskId, description);

			return res.status(200).json({
				success: true,
				msg: "Task submitted successfully",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/students/comment/:taskId
// @desc    Submit comment in a task
// @access  Private
router.post(
	"/comment/:taskId",
	[
		authUser,
		roleUser("student"),
		check("comment", "Comment is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			const user = req.user.id;
			const taskId = req.params.taskId;
			const { comment } = req.body;
			//console.log(user, taskId, comment);
			await addComment(taskId, user, comment);

			return res.status(200).json({
				success: true,
				msg: "Comment added successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/students/projectDes/:registered_course_id
// @desc    Update project details
// @access  Private
router.post(
	"/projectDes/:registered_course_id",
	[
		authUser,
		roleUser("student"),
		check("title", "Title is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			const user = req.user.id;
			const takenCourseId = req.params.registered_course_id;
			const { title, description } = req.body;
			console.log(title, description, takenCourseId);
			const team = await findTeam(user, takenCourseId);

			await updateTeam(team._id, title, description);

			return res.status(200).json({
				success: true,
				msg: "Description updated successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

module.exports = router;

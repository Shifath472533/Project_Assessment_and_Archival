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
const {
	getTeacherAssignedCoursesActive,
	getTeacherAssignedCoursesInactive,
} = require("../../services/teacherQueries");
const { serverError, readCSVData } = require("../../services/functions");
const {
	getAllInvitationOfCourse,
	acceptInvitationTeacher,
	declineInvitationTeacher,
} = require("../../services/teamInvitationQueries");
const {
	getAllTeamOfCourse,
	getTheTasksOfTeam,
	addTaskId,
	deleteTaskId,
	createNewTeam,
	getTheDetailsOfTeam,
	deleteTeam,
	updateTeam,
	updateTeamTitle,
} = require("../../services/teamQueries");
const {
	getAssignedCourse,
	initializeAssignedCourse,
	endRunningCourse,
} = require("../../services/assignedCourseQueries");
const {
	createTask,
	updateTask,
	getTaskDetails,
	deleteTask,
	giveMarkToTask,
	addComment,
	addTaskFileTeacher,
} = require("../../services/taskQueries");
const { getUserByUsername } = require("../../services/userQueries");
const { getTeamIdOfTakenCourse } = require("../../services/studentQueries");
const Task = require("../../models/Task");

// @route   GET api/teachers/courses
// @desc    Get all the courses with title, code and session
// @access  Private
router.get("/courses", [authUser, roleUser("teacher")], async (req, res) => {
	try {
		const user = req.user.id;

		const activeCourses = await getTeacherAssignedCoursesActive(user);
		const inactiveCourses = await getTeacherAssignedCoursesInactive(user);

		activeCourses.sort((a, b) =>
			a.year < b.year ? 1 : b.year < a.year ? -1 : 0
		);
		inactiveCourses.sort((a, b) =>
			a.year < b.year ? 1 : b.year < a.year ? -1 : 0
		);

		//console.log(activeCourses, inactiveCourses);

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

// @route   GET api/teachers/specificCourse/:assigned_course_id
// @desc    Get a specific courses
// @access  Private
router.get(
	"/specificCourse/:course_id",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const course_id = req.params.course_id;
			const course = await getAssignedCourse(course_id);

			return res.status(200).json({
				success: true,
				msg: "Found the courses",
				data: course,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/teachers/teams/:assigned_course_id
// @desc    Get all the teams of an assigned course
// @access  Private
router.get(
	"/teams/:assigned_course_id",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const takenCourseId = req.params.assigned_course_id;
			const takenCourse = await getAssignedCourse(takenCourseId);
			if (!takenCourse.initialized) {
				return res.json({
					success: false,
					msg: "Course is not initialized yet",
					data: null,
				});
			}
			const teamInvitations = await getAllInvitationOfCourse(
				takenCourseId
			);
			const { team, allUserInfo } = await getAllTeamOfCourse(
				takenCourseId
			);

			return res.status(200).json({
				success: true,
				msg: "Found the teams/invitations.",
				data: {
					team: team,
					invited_teams: teamInvitations,
					allUserInfo: allUserInfo,
				},
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/teachers/specificTeam/:team_id
// @desc    Get a specific team
// @access  Private
router.get(
	"/specificTeam/:team_id",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const teamId = req.params.team_id;
			const { team, userInfo, studentInfo } = await getTheDetailsOfTeam(
				teamId
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

// @route   POST api/teachers/initialization/:assigned_course_id
// @desc    Initialize a course of a session
// @access  Private
router.post(
	"/initialization/:assigned_course_id",
	[
		authUser,
		roleUser("teacher"),
		check("description", "Description is required").not().isEmpty(),
		check("maxMember", "Max Member value is required").not().isEmpty(),
		check("minMember", "Min Member value is required").not().isEmpty(),
		check("formationDate", "Team formation final date is required")
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
			const { description, maxMember, minMember, formationDate } =
				req.body;
			const takenCourseId = req.params.assigned_course_id;
			await initializeAssignedCourse(
				takenCourseId,
				description,
				maxMember,
				minMember,
				formationDate
			);
			return res.status(200).json({
				success: true,
				msg: "Course initialized successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   PUT api/teachers/invitedTeam/:teamInvitationId/:decision
// @desc    Accept or decline a team
// @access  Private
router.put(
	"/invitedTeam/:teamInvitationId/:decision",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const teamInvitationId = req.params.teamInvitationId;
			const decision = req.params.decision;

			if (decision == "accept") {
				await acceptInvitationTeacher(teamInvitationId);

				return res.status(200).json({
					success: true,
					msg: "Team invitation accepted.",
					data: null,
				});
			} else {
				await declineInvitationTeacher(teamInvitationId);
				return res.status(200).json({
					success: true,
					msg: "Team invitation declined.",
					data: null,
				});
			}
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	GET api/teachers/tasks/:teamId
// @desc	Get all the task of a team
// @access	Private
router.get(
	"/tasks/:teamId",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const teamId = req.params.teamId;
			const tasks = await getTheTasksOfTeam(teamId);
			tasks.sort((a, b) =>
				a.date < b.date ? 1 : b.date < a.date ? -1 : 0
			);

			return res.status(200).json({
				success: true,
				msg: "All the tasks",
				data: tasks,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	GET api/teachers/tasks/:taskId
// @desc	Get specific task
// @access	Private
router.get(
	"/specificTask/:taskId",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const taskId = req.params.taskId;
			const taskDetails = await getTaskDetails(taskId);

			return res.status(200).json({
				success: true,
				msg: "Specific task",
				data: {
					task: taskDetails.task,
					comment: taskDetails.commentList,
				},
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	POST api/teachers/task/:teamId
// @desc	Post task file for a team
// @access	Private
router.post(
	"/taskFile/:teamId/:taskId",
	[authUser, roleUser("teacher"), upload.single("file")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			const teamId = req.params.teamId;
			const taskId = req.params.taskId;
			const directory = req.file.path.toString().split("/");

			await addTaskFileTeacher(taskId, teamId, directory[1]);

			return res.status(200).json({
				success: true,
				msg: "Task is posted",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	POST api/teachers/task/:teamId
// @desc	Post a task for a team
// @access	Private
router.post(
	"/task/:teamId",
	[
		authUser,
		roleUser("teacher"),
		check("description", "Description is required").not().isEmpty(),
		check("totalMark", "Total mark value is required").not().isEmpty(),
		check("title", "Title is required").not().isEmpty(),
		check("deadline", "Deadline is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			const teamId = req.params.teamId;
			const { title, description, totalMark, deadline } = req.body;
			//console.log(req.body);
			const task = await createTask(
				teamId,
				title,
				description,
				totalMark,
				deadline
			);
			await addTaskId(teamId, task._id);

			return res.status(200).json({
				success: true,
				msg: "Task is posted",
				data: task,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	PUT api/teachers/task/:taskId
// @desc	Update a task of a team
// @access	Private
router.put(
	"/task/:taskId",
	[
		authUser,
		roleUser("teacher"),
		check("title", "Title is required").not().isEmpty(),
		check("description", "Description is required").not().isEmpty(),
		check("totalMark", "Total mark value is required").not().isEmpty(),
		check("deadline", "Deadline is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const taskId = req.params.taskId;
			const { title, description, totalMark, deadline } = req.body;

			await updateTask(taskId, title, description, totalMark, deadline);

			return res.status(200).json({
				success: true,
				msg: "Task is updated",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	DELETE api/teachers/task/:taskId
// @desc	Delete a task of a team
// @access	Private
router.delete(
	"/task/:taskId",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		try {
			const taskId = req.params.taskId;

			const task = await getTaskDetails(taskId);
			await deleteTaskId(task.team_id, taskId);
			await deleteTask(taskId);

			return res.status(200).json({
				success: true,
				msg: "Task is deleted successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	POST api/teachers/taskEvaluation/:taskId
// @desc	Post evaluation of a task of a team
// @access	Private
router.post(
	"/taskEvaluation/:taskId",
	[
		authUser,
		roleUser("teacher"),
		check("accuiredMark", "Accuired Mark value is required")
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
			const taskId = req.params.taskId;
			const { accuiredMark } = req.body;

			await giveMarkToTask(taskId, accuiredMark);

			return res.status(200).json({
				success: true,
				msg: "Task is evaluated",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	POST api/teachers/comment/:taskId"
// @desc	Post a comment in a task of a team
// @access	Private
router.post(
	"/comment/:taskId",
	[
		authUser,
		roleUser("teacher"),
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

			await addComment(taskId, user, comment);

			return res.status(200).json({
				success: true,
				msg: "Comment is posted",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	POST api/teachers/teamCSV/:assigned_course_id"
// @desc	Post a team
// @access	Private
router.post(
	"/teamCSV/:assigned_course_id",
	[authUser, roleUser("teacher"), upload.single("file")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}
		try {
			console.log("The file: ", req.file.path);
			const assigned_course_id = req.params.assigned_course_id;
			const teams = await readCSVData(req.file.path);

			for (const item in teams) {
				const title = teams[item].title;
				var members_id = [];
				var reg = teams[item].member1;
				var member = await getUserByUsername(reg);

				var hasTeam = await getTeamIdOfTakenCourse(
					member._id,
					assigned_course_id
				);
				if (!hasTeam) members_id.push(member._id);

				if (teams[item].member2 != "") {
					reg = teams[item].member2;
					member = await getUserByUsername(reg);
					hasTeam = await getTeamIdOfTakenCourse(
						member._id,
						assigned_course_id
					);
					if (!hasTeam) members_id.push(member._id);
				}
				if (teams[item].member3 != "") {
					reg = teams[item].member3;
					member = await getUserByUsername(reg);
					var hasTeam = await getTeamIdOfTakenCourse(
						member._id,
						assigned_course_id
					);
					if (!hasTeam) members_id.push(member._id);
				}
				console.log(title, assigned_course_id, members_id);
				if (members_id.length > 0)
					await createNewTeam(title, assigned_course_id, members_id);
			}
			return res.status(200).json({
				success: true,
				msg: "File is posted",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	POST api/teachers/updateTeam/:team_id"
// @desc	Update a team
// @access	Private
router.post(
	"/updateTeam/:team_id",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const team_id = req.params.team_id;
			const { title } = req.body;
			await updateTeamTitle(team_id, title);
			return res.status(200).json({
				success: true,
				msg: "Team is updated",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	DELETE api/teachers/team/:team_id"
// @desc	Delete a team
// @access	Private
router.delete(
	"/team/:team_id",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const team_id = req.params.team_id;
			//console.log(team_id);
			await deleteTeam(team_id);

			return res.status(200).json({
				success: true,
				msg: "Team is deleted",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route	PUT api/teachers/endCourse/:course_id
// @desc	End a course
// @access	Private
router.put(
	"/endCourse/:course_id",
	[authUser, roleUser("teacher")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array(), data: null });
		}
		try {
			const course_id = req.params.course_id;

			await endRunningCourse(course_id);

			return res.status(200).json({
				success: true,
				msg: "Course is Ended",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

module.exports = router;

const express = require("express");
const router = express.Router();

const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const path = "./archive";
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

const { authUser } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const { serverError } = require("../../services/functions");
const Archive = require("../../models/Archive");
const Course = require("../../models/Course");
const { getCourse } = require("../../services/courseQueries");
const Team = require("../../models/Team");
const { getTheDetailsOfTeam } = require("../../services/teamQueries");

// @route   GET api/archive/projects/:course_id/:year
// @desc    All the archived projects
// @access  Private
router.get("/projects/:course_id/:year", authUser, async (req, res) => {
	try {
		const course_id = req.params.course_id;
		const year = req.params.year;
		const archives = await Archive.find({
			course_id: course_id,
			year: year,
		}).sort({
			date: -1,
		});

		//var userDetails = [];
		var totalDetails = [];
		for (const eachArchive of archives) {
			//console.log(eachArchive);
			const teamId = eachArchive.team_id;

			const { team, userInfo, studentInfo } = await getTheDetailsOfTeam(
				teamId
			);
			//console.log(team, userInfo, studentInfo);
			//const userDetails = [userInfo];

			const total = {
				eachArchive,
				userInfo,
			};
			totalDetails.push(total);
		}

		return res.status(200).json({
			success: true,
			msg: "Projects found successfully.",
			data: /* { archives: archives, userDetails: userDetails } */ totalDetails,
		});
	} catch (error) {
		serverError(error, res);
	}
});

// @route   POST api/archive
// @desc    Submit a project
// @access  Private
router.post(
	"/",
	[
		authUser,
		check("title", "Title is required").not().isEmpty(),
		check("year", "Year is required").not().isEmpty(),
		check("description", "Description is required").not().isEmpty(),
		check("course_id", "Course is required").not().isEmpty(),
		check("team_id", "Team is required").not().isEmpty(),
		check("tag", "Tag is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const { title, description, year, course_id, team_id, tag } =
				req.body;
			const user = req.user.id;
			//console.log(title, description, year, course_id, team_id, tag);
			const tags = tag.toString().split(";");
			const project = new Archive({
				title: title,
				description: description,
				user: user,
				course_id: course_id,
				year: year,
				team_id: team_id,
				tag: tags,
			});

			await project.save();
			return res.status(200).json({
				success: true,
				msg: "Project uploaded successfully.",
				data: project,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   POST api/archive
// @desc    Submit a project file
// @access  Private
router.post(
	"/:projectId",
	[authUser, upload.single("file")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, msg: errors.array() });
		}

		try {
			const projectId = req.params.projectId;
			const { size } = req.body;
			const directory = req.file.path.toString().split("/");
			console.log(directory);
			await Archive.findOneAndUpdate(
				{ _id: projectId },
				{
					$set: {
						directory: directory[1],
						size: size,
					},
				}
			);

			return res.status(200).json({
				success: true,
				msg: "Project uploaded successfully.",
				data: null,
			});
		} catch (error) {
			serverError(error, res);
		}
	}
);

// @route   GET api/archive/courses/:year
// @desc    All the courses of a year
// @access  Private
router.get("/courses/:year", authUser, async (req, res) => {
	try {
		const year = req.params.year;
		const courses = await Course.find({ year }).sort({ date: -1 });
		var courseList = [];
		for (const course of courses) {
			const courseInfo = await getCourse(course.course_id);
			courseList.push(courseInfo);
		}
		return res.status(200).json({
			success: true,
			msg: "Courses found successfully.",
			data: courseList,
		});
	} catch (error) {
		serverError(error, res);
	}
});

// @route   GET api/archive/teams/:course_id/:year
// @desc    All the teams of a course
// @access  Private
router.get("/teams/:course_id/:year", authUser, async (req, res) => {
	try {
		const course_id = req.params.course_id;
		const year = req.params.year;
		const course = await Course.findOne({ course_id, year });

		const teams = await Team.find({ course_id: course._id });

		return res.status(200).json({
			success: true,
			msg: "Teams found successfully.",
			data: teams,
		});
	} catch (error) {
		serverError(error, res);
	}
});

module.exports = router;

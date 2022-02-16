const AssignedCourse = require("../models/Course");
const { getCourse } = require("./courseQueries");

module.exports.findAssignedCourse = async function (course_id, year) {
	const assignedCourse = await AssignedCourse.findOne({
		course_id,
		year,
	});

	return assignedCourse;
};

module.exports.findAssignedCourseTeacher = async function (
	course_id,
	teacher_id,
	year
) {
	const assignedCourse = await AssignedCourse.findOne({
		course_id,
		teacher_id,
		year,
	});

	/* console.log(assignedCourse); */

	return assignedCourse;
};

module.exports.createAssignedCourse = async function (
	course_id,
	teacher_id,
	year
) {
	const newCourse = new AssignedCourse({
		course_id,
		teacher_id,
		year,
	});

	await newCourse.save();
	return newCourse._id;
};

module.exports.addTeacherAssignedCourse = async function (_id, teacher_id) {
	await AssignedCourse.findOneAndUpdate(
		{ _id },
		{
			$push: {
				teacher_id: teacher_id,
			},
		}
	);
};

module.exports.deleteAssignedCourse = async function (
	course_id,
	teacher_id,
	year
) {
	await Course.findOneAndRemove({ course_id, teacher_id, year });
};

module.exports.getAssignedCourse = async function (_id) {
	const assignedCourseInfo = await AssignedCourse.findOne({ _id });
	return assignedCourseInfo;
};

module.exports.initializeAssignedCourse = async function (
	_id,
	description,
	maxMember,
	minMember,
	formationDate
) {
	await AssignedCourse.findOneAndUpdate(
		{ _id },
		{
			$set: {
				description: description,
				"member_no.max": maxMember,
				"member_no.min": minMember,
				formation_date: formationDate,
				initialized: true,
			},
		}
	);
};

module.exports.getMainCourse = async function (_id) {
	const assignedCourseInfo = await AssignedCourse.findOne({ _id });
	const course = await getCourse(assignedCourseInfo.course_id);
	return course;
};

module.exports.getRunningCourse = async function () {
	const assignedCourseInfo = await AssignedCourse.find({
		active: true,
		/* year: year, */
	}).sort({ date: -1 });
	return assignedCourseInfo;
};

module.exports.endRunningCourse = async function (_id) {
	await AssignedCourse.findOneAndUpdate({ _id }, { $set: { active: false } });
};

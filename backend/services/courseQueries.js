const Course = require("../models/CourseInfo");

module.exports.getAllCourse = async function () {
	const courseInfo = await Course.find({ status: true }).sort({
		semester: 1,
		code: 1,
	});
	return courseInfo;
};

module.exports.findCourse = async function (code) {
	const course = await Course.findOne({ code });
	return course;
};

module.exports.createCourse = async function (
	title,
	code,
	credit,
	semester,
	description
) {
	const newCourse = new Course({
		title,
		code,
		credit,
		semester,
		description,
	});

	await newCourse.save();
};

module.exports.removeCourse = async function (code) {
	await Course.findOneAndUpdate(
		{
			code,
		},
		{
			status: false,
		}
	);
};

module.exports.updateCourse = async function (
	title,
	code,
	credit,
	semester,
	description
) {
	await Course.findOneAndUpdate(
		{
			code,
		},
		{
			title,
			credit,
			semester,
			description,
		}
	);
};

module.exports.getCourse = async function (_id) {
	const courseInfo = await Course.findOne({ _id });
	return courseInfo;
};

module.exports.getSemesterBasedCourse = async function (semester) {
	const courseInfos = await Course.find({ semester });
	return courseInfos;
};

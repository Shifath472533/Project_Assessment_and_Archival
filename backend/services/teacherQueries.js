const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const { getUserById } = require("./userQueries");
const { getAssignedCourse } = require("./assignedCourseQueries");
const { getCourse } = require("./courseQueries");

module.exports.createTeacher = async function (teacherData) {
	const teacher = new Teacher(teacherData);
	await teacher.save();
	return teacher;
};

module.exports.updateTeacher = async function (user, teacherData) {
	await Teacher.findOneAndUpdate(
		{ user },
		{
			$set: {
				name: teacherData.name,
				dob: teacherData.dob,
				email: teacherData.email,
				designation: teacherData.designation,
				githubusername: teacherData.githubusername,
			},
		}
	);
};

var findTeacherUser = (module.exports.findTeacherUser = async function (
	name,
	email,
	dob
) {
	const teacherUserInfo = await Teacher.findOne({ name, email, dob });
	if (teacherUserInfo == null) {
		return null;
	}
	return teacherUserInfo;
});

module.exports.getAllTeachersInfo = async function () {
	const teacherUserInfo = await Teacher.find({ active: true }).sort({
		data: -1,
	});
	let teachers = [];
	for (const info of teacherUserInfo) {
		const teacherUser = await getUserById(info.user);
		const teacher = {
			_id: info._id,
			user: info.user,
			username: teacherUser.username,
			name: info.name,
			dob: info.dob,
			email: info.email,
			designation: info.designation,
			joining_date: info.date,
			githubusername: info.githubusername,
		};
		teachers.push(teacher);
	}
	return teachers;
};

module.exports.activateTeacherUser = async function (name, email, dob) {
	await Teacher.findOneAndUpdate(
		{ name, email, dob },
		{
			active: true,
		}
	);
	const teacherUserInfo = await findTeacherUser(name, email, dob);
	return teacherUserInfo;
};

module.exports.deactivateTeacherUser = async function (_id) {
	await Teacher.findOneAndUpdate(
		{ _id },
		{
			active: false,
		}
	);
};

var getTeacherUser = (module.exports.getTeacherUser = async function (_id) {
	console.log(_id);
	const teacherUser = await Teacher.findOne({ _id });
	return teacherUser;
});

module.exports.getTeacherUser2 = async function (user) {
	const teacherUser = await Teacher.findOne({ user });
	return teacherUser;
};

module.exports.addCourseToTeacher = async function (_id, assignedCourseId) {
	await Teacher.findOneAndUpdate(
		{ _id },
		{
			$push: {
				taken_courses: {
					course_id: assignedCourseId,
				},
			},
		}
	);

	const teacher = await Teacher.findOne({ _id });
	//console.log(teacher);
};

module.exports.removeCourseFromTeacher = async function (
	_id,
	assignedCourseId
) {
	await Teacher.findOneAndUpdate(
		{ _id },
		{
			$pull: {
				taken_courses: {
					course_id: assignedCourseId,
				},
			},
		}
	);
	const teacherUser = await getTeacherUser(_id);
	return teacherUser;
};

module.exports.getTeacherAssignedCoursesActive = async function (user) {
	const teacher = await Teacher.findOne({ user });
	//console.log(teacher.taken_courses);
	let activeCourses = [];
	const takenCourses = teacher.taken_courses;
	for (const eachTakenCourse of takenCourses) {
		const takenCourseId = eachTakenCourse.course_id;
		//console.log(takenCourseId);
		const takenCourse = await getAssignedCourse(takenCourseId);

		//console.log(takenCourse);
		if (takenCourse.active) {
			const courseDetails = await getCourse(takenCourse.course_id);
			const course = {
				_id: takenCourseId,
				code: courseDetails.code,
				title: courseDetails.title,
				semester: courseDetails.semester,
				year: takenCourse.year,
			};
			activeCourses.push(course);
		}
	}
	return activeCourses;
};

module.exports.getTeacherAssignedCoursesInactive = async function (user) {
	const teacher = await Teacher.findOne({ user });
	let activeCourses = [];
	const takenCourses = teacher.taken_courses;
	for (const eachTakenCourse of takenCourses) {
		const takenCourseId = eachTakenCourse.course_id;
		const takenCourse = await getAssignedCourse(takenCourseId);

		if (!takenCourse.active) {
			const courseDetails = await getCourse(takenCourse.course_id);
			const course = {
				_id: takenCourseId,
				code: courseDetails.code,
				title: courseDetails.title,
				semester: courseDetails.semester,
				year: takenCourse.year,
			};
			activeCourses.push(course);
		}
	}
	return activeCourses;
};

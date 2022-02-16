const Student = require("../models/Student");
const { getUserById } = require("./userQueries");
const { getAssignedCourse } = require("./assignedCourseQueries");
const { getCourse } = require("./courseQueries");

module.exports.getAllStudentUser = async function (session) {
	const studentUser = await Student.find({ session: session, active: true });
	let students = [];
	for (const info of studentUser) {
		const studentUser = await getUserById(info.user);
		const student = {
			_id: info._id,
			user: info.user,
			username: studentUser.username,
			name: info.name,
			dob: info.dob,
			email: info.email,
			session: info.session,
			githubusername: info.githubusername,
		};
		students.push(student);
	}
	return students;
};

module.exports.createStudent = async function (studentData) {
	const student = new Student(studentData);
	await student.save();
	return student;
};

module.exports.updateStudent = async function (user, studentData) {
	await Student.findOneAndUpdate(
		{ user },
		{
			$set: {
				name: studentData.name,
				dob: studentData.dob,
				email: studentData.email,
				githubusername: studentData.githubusername,
			},
		}
	);
};

var findStudentUser = (module.exports.findStudentUser = async function (
	name,
	email,
	dob
) {
	const studentUserInfo = await Student.findOne({ name, email, dob });
	if (studentUserInfo == null) {
		return null;
	}
	return studentUserInfo;
});

var getStudentUser = (module.exports.getStudentUser = async function (user) {
	const studentUserInfo = await Student.findOne({ user });
	return studentUserInfo;
});

module.exports.activateStudentUser = async function (name, email, dob) {
	await Student.findOneAndUpdate(
		{ name, email, dob },
		{
			active: true,
		}
	);
	const studentUserInfo = await findStudentUser(name, email, dob);
	return studentUserInfo;
};

module.exports.deactivateStudentUser = async function (_id) {
	await Student.findOneAndUpdate(
		{ _id },
		{
			active: false,
		}
	);
};

var findRegisteredCourse = (module.exports.findRegisteredCourse =
	async function (user, assigned_course_id) {
		const registeredCourse = await Student.findOne({
			user,
			"taken_courses.course_id": assigned_course_id,
		});
		if (registeredCourse) return true;
		return null;
	});

module.exports.registerStudentInCourse = async function (
	user,
	assigned_course_id
) {
	await Student.findOneAndUpdate(
		{ user },
		{
			$push: {
				taken_courses: {
					course_id: assigned_course_id,
				},
			},
		}
	);
};

module.exports.unregisterStudentInCourse = async function (
	user,
	assigned_course_id
) {
	await Student.findOneAndUpdate(
		{ user },
		{
			$pull: {
				taken_courses: {
					course_id: assigned_course_id,
				},
			},
		}
	);
};

module.exports.getStudentTakenCoursesActive = async function (user) {
	const student = await getStudentUser(user);
	let activeCourses = [];

	const takenCourses = student.taken_courses;
	for (const eachTakenCourse of takenCourses) {
		const takenCourseId = eachTakenCourse.course_id;
		const takenCourse = await getAssignedCourse(takenCourseId);

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

module.exports.getStudentTakenCoursesInactive = async function (user) {
	const student = await getStudentUser(user);
	let inactiveCourses = [];

	const takenCourses = student.taken_courses;
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
			inactiveCourses.push(course);
		}
	}
	return inactiveCourses;
};

module.exports.getTeamIdOfTakenCourse = async function (user, taken_course_id) {
	const studentUser = await Student.findOne({
		user,
		"taken_courses.course_id": taken_course_id,
	});

	const takenCourses = studentUser.taken_courses;
	for (const eachTakenCourse of takenCourses) {
		if (eachTakenCourse.course_id == taken_course_id) {
			return eachTakenCourse.team_id;
		}
	}
	return null;
};

module.exports.removeTeam = async function (_id, team_id) {
	console.log(_id, team_id);
	await Student.findOneAndUpdate(
		{ _id, "taken_courses.team_id": team_id },
		{
			$set: {
				"taken_courses.$.team_id": null,
			},
		}
	);
};

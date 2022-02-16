const Team = require("../models/Team");
const Student = require("../models/Student");
const { getTaskDetails } = require("./taskQueries");
const { getUserById } = require("./userQueries");
const { getStudentUser, removeTeam } = require("./studentQueries");

var getTheDetailsOfTeam = (module.exports.getTheDetailsOfTeam = async function (
	_id
) {
	const team = await Team.findOne({ _id });
	const membersId = team.members_id;
	var userInfo = [],
		studentInfo = [];
	for (const item in membersId) {
		userInfo.push(await getUserById(membersId[item]));
		studentInfo.push(await getStudentUser(membersId[item]));
		//console.log(membersId[item]);
	}
	//console.log(team, userInfo, studentInfo);
	return { team, userInfo, studentInfo };
});

module.exports.getTheTasksOfTeam = async function (_id) {
	const team = await Team.findOne({ _id });
	//console.log(_id);
	const taskIds = team.tasks_id;
	if (taskIds) {
		let tasks = [];
		for (const eachTaskId of taskIds) {
			//console.log(eachTaskId);
			const taskInfo = await getTaskDetails(eachTaskId);
			//console.log(eachTaskId);
			//console.log(taskInfo.task);
			const task = {
				_id: eachTaskId,
				title: taskInfo.task.title,
				deadline: taskInfo.task.deadline,
				date: taskInfo.task.date,
			};
			tasks.push(task);
		}
		return tasks;
	}
	return null;
};

module.exports.getAllTeamOfCourse = async function (takenCourseId) {
	const team = await Team.find({ course_id: takenCourseId });
	var allUserInfo = [];

	for (const item in team) {
		var userInfo = [];
		const membersId = team[item].members_id;

		for (const eachId in membersId) {
			const user = await getUserById(membersId[eachId]);
			userInfo.push(user);
		}
		allUserInfo.push(userInfo);
	}
	const data = {
		team: team,
		allUserInfo: allUserInfo,
	};
	return data;
};

module.exports.createNewTeam = async function (title, course_id, members_id) {
	const team = new Team({
		title,
		course_id,
		members_id,
	});
	await team.save();

	for (const member in members_id) {
		//console.log(members_id[member]);
		await Student.findOneAndUpdate(
			{ user: members_id[member], "taken_courses.course_id": course_id },
			{
				$set: {
					"taken_courses.$.team_id": team._id,
				},
			}
		);
	}
};

module.exports.addTaskId = async function (_id, tasks_id) {
	await Team.findOneAndUpdate(
		{ _id },
		{
			$push: {
				tasks_id,
			},
		}
	);
};

module.exports.deleteTaskId = async function (_id, task_id) {
	console.log(_id, task_id);
	await Team.findOneAndUpdate(
		{
			_id,
		},
		{
			$pull: {
				tasks_id: task_id,
			},
		}
	);
};

module.exports.findTeam = async function (user, course_id) {
	const team = await Team.findOne({ course_id, members_id: user });
	return team;
};

module.exports.deleteTeam = async function (_id) {
	const { team, userInfo, studentInfo } = await getTheDetailsOfTeam(_id);

	for (const student of studentInfo) {
		await removeTeam(student._id, _id);
	}
	await Team.findOneAndDelete({
		_id,
	});
};

module.exports.updateTeamTitle = async function (_id, title) {
	await Team.findOneAndUpdate(
		{ _id },
		{
			$set: {
				title: title,
			},
		}
	);
};
module.exports.updateTeam = async function (_id, title, description) {
	await Team.findOneAndUpdate(
		{ _id },
		{
			$set: {
				projectTitle: title,
				details: description,
			},
		}
	);
};

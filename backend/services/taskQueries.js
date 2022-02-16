const Task = require("../models/Task");
const { getUserById } = require("./userQueries");

module.exports.getTaskDetails = async function (_id) {
	const task = await Task.findOne({ _id });
	const comments = task.comments;
	var commentList = [];
	for (const eachComment of comments) {
		const user = await getUserById(eachComment.user_id);
		const comment = {
			_id: eachComment._id,
			user_id: eachComment.user_id,
			comment: eachComment.comment,
			time: eachComment.time,
			username: user.username,
		};
		commentList.push(comment);
	}
	//console.log(task, commentList);
	return { task, commentList };
};

module.exports.submitTaskFile = async function (_id, user, directory) {
	await Task.findOneAndUpdate(
		{
			_id,
		},
		{
			submission: {
				user_id: user,
				directory: directory,
			},
		}
	);
};

module.exports.submitTaskDetails = async function (_id, description) {
	await Task.findOneAndUpdate(
		{
			_id,
		},
		{
			"submission.description": description,
		}
	);
};

module.exports.addComment = async function (_id, user, comment) {
	await Task.findOneAndUpdate(
		{
			_id,
		},
		{
			$push: {
				comments: {
					user_id: user,
					comment,
				},
			},
		}
	);
};

module.exports.createTask = async function (
	team_id,
	title,
	description,
	totalMark,
	deadline
) {
	const tasks = await Task.find({ team_id });
	const taskNumber = tasks == null ? 1 : tasks.length + 1;

	const task = new Task();
	task.title = title == null ? "Task " + taskNumber : title;
	task.team_id = team_id;
	task.description = description;
	task.mark.total = totalMark;
	task.deadline = deadline;
	await task.save();
	return task;
};

module.exports.addTaskFileTeacher = async function (
	task_id,
	team_id,
	directory
) {
	await Task.findOneAndUpdate(
		{ _id: task_id, team_id },
		{
			$set: {
				directory: directory,
			},
		}
	);
};

module.exports.updateTask = async function (
	_id,
	title,
	description,
	totalMark,
	deadline
) {
	await Task.findOneAndUpdate(
		{
			_id,
		},
		{
			$set: {
				title: title,
				description: description,
				"mark.total": totalMark,
				deadline: deadline,
			},
		}
	);
};

module.exports.deleteTask = async function (_id) {
	await Task.findOneAndDelete({
		_id,
	});
};

module.exports.giveMarkToTask = async function (_id, accuiredMark) {
	await Task.findOneAndUpdate(
		{
			_id,
		},
		{
			$set: {
				"mark.accuired": accuiredMark,
			},
		}
	);
};

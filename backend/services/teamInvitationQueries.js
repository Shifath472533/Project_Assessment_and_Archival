const Invitation = require("../models/TeamInvitation");
const { getAssignedCourse } = require("./assignedCourseQueries");
const { createNewTeam } = require("./teamQueries");
const { getUserByUsername } = require("./userQueries");

module.exports.gotAnyInvitaion = async function (user, taken_course_id) {
	const invitationInfo = await Invitation.findOne({
		"to.user": user,
		course_id: taken_course_id,
	});
	return invitationInfo;
};

module.exports.didInviteAnyone = async function (user, taken_course_id) {
	const invitationInfo = await Invitation.findOne({
		from_id: user,
		course_id: taken_course_id,
	});
	return invitationInfo;
};

module.exports.createNewInvitation = async function (
	user,
	takenCourseId,
	team_name,
	invited_students_reg
) {
	let invited_to = [];
	for (const invited_student_reg of invited_students_reg) {
		const userInfo = await getUserByUsername(invited_student_reg);
		const invited_id = {
			user: userInfo._id,
		};
		invited_to.push(invited_id);
	}

	const takenCourse = await getAssignedCourse(takenCourseId);

	const newInvitation = new Invitation({
		team_name: team_name,
		from_id: user,
		to: invited_to,
		course_id: takenCourseId,
		year: takenCourse.year,
	});
	await newInvitation.save();
};

module.exports.addNewInvitationStudent = async function (
	user,
	takenCourseId,
	invited_students_reg
) {
	const takenCourse = await getAssignedCourse(takenCourseId);
	for (const invited_student_reg of invited_students_reg) {
		const userInfo = await getUserByUsername(invited_student_reg);

		await Invitation.findOneAndUpdate(
			{
				from_id: user,
				course_id: takenCourseId,
				year: takenCourse.year,
			},
			{
				$push: {
					to: {
						user: userInfo._id,
					},
				},
			}
		);
	}
};

module.exports.acceptInvitationStudent = async function (user, takenCourseId) {
	await Invitation.findOneAndUpdate(
		{
			"to.user": user,
			course_id: takenCourseId,
		},
		{
			$set: {
				"to.$.status": true,
			},
		}
	);
};

module.exports.declineInvitation = async function (user, takenCourseId) {
	await TeamInvitation.findOneAndUpdate(
		{
			"to.user": user,
			course_id: takenCourseId,
		},
		{
			$pull: {
				to: {
					user: user,
				},
			},
		}
	);
};

module.exports.getAllInvitationOfCourse = async function (takenCourseId) {
	const invitations = await Invitation.find({
		course_id: takenCourseId,
		isApproved: false,
	});
	return invitations;
};

module.exports.acceptInvitationTeacher = async function (_id) {
	await Invitation.findOneAndUpdate(
		{
			_id,
		},
		{
			$set: {
				isApproved: true,
			},
		}
	);

	const invitedTeam = await Invitation.findOne({
		_id,
	});
	let members = [invitedTeam.from_id];
	for (const member of invitedTeam.to) {
		members.push(member.user);
	}
	await createNewTeam(invitedTeam.title, invitedTeam.course_id, members);
};

module.exports.declineInvitationTeacher = async function (_id) {
	await Invitation.findOneAndDelete({
		_id,
	});
};

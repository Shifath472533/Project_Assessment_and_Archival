import Axios from "axios";
import { trackPromise } from "react-promise-tracker";
const baseURL = "http://localhost:5000/api/teachers";
const token = localStorage.getItem("token");

export const teacherAllCourse = async () => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/courses`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const allTeamOfCourse = async (assigned_course_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/teams/${assigned_course_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const uploadTeamCSV = async (data, assigned_course_id) => {
	const headers = {
		"x-auth-token": token,
		"Content-Type": "multipart/form-data",
	};
	try {
		const res = await Axios.post(
			`${baseURL}/teamCSV/${assigned_course_id}`,
			data,
			{
				headers,
			}
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const allTaskOfTeam = async (teamId) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/tasks/${teamId}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const specificTask = async (_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/specificTask/${_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const initializeCourse = async (
	description,
	deadline,
	min,
	max,
	assigned_course_id
) => {
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};

	const data = JSON.stringify({
		description: description,
		formationDate: deadline,
		minMember: min,
		maxMember: max,
	});
	try {
		const res = await trackPromise(
			Axios.post(
				`${baseURL}/initialization/${assigned_course_id}`,
				data,
				{
					headers,
				}
			)
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const endCourse = async (course_id) => {
	const data = null;
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.put(`${baseURL}/endCourse/${course_id}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const specificCourse = async (assigned_course_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/specificCourse/${assigned_course_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const specificTeam = async (_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/specificTeam/${_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const updateTeam = async (teamId, title) => {
	const data = JSON.stringify({
		title: title,
	});
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.post(`${baseURL}/updateTeam/${teamId}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const deleteTeam = async (teamId) => {
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.delete(`${baseURL}/team/${teamId}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const postTaskFile = async (teamId, taskId, formData) => {
	const headers = {
		"x-auth-token": token,
		"Content-Type": "multipart/form-data",
	};
	try {
		const res = await trackPromise(
			Axios.post(`${baseURL}/taskFile/${teamId}/${taskId}`, formData, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const postTask = async (
	teamId,
	title,
	description,
	totalMark,
	deadline
) => {
	const data = JSON.stringify({
		title: title,
		description: description,
		totalMark: totalMark,
		deadline: deadline,
	});
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.post(`${baseURL}/task/${teamId}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const updateTask = async (
	taskId,
	title,
	description,
	totalMark,
	deadline
) => {
	const data = JSON.stringify({
		title: title,
		description: description,
		totalMark: totalMark,
		deadline: deadline,
	});
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.put(`${baseURL}/task/${taskId}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const deleteTask = async (taskId) => {
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.delete(`${baseURL}/task/${taskId}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addComment = async (taskId, comment) => {
	const data = JSON.stringify({
		comment: comment,
	});
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.post(`${baseURL}/comment/${taskId}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const giveMark = async (taskId, mark) => {
	const data = JSON.stringify({
		accuiredMark: mark,
	});
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.post(`${baseURL}/taskEvaluation/${taskId}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

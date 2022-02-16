import Axios from "axios";
import { trackPromise } from "react-promise-tracker";
const baseURL = "http://localhost:5000/api/students";
const token = localStorage.getItem("token");

export const studentAllCourse = async () => {
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

export const allTaskOfCourse = async (registered_course_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/${registered_course_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const specificTaskOfTeam = async (_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/task/${_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const submitTaskFile = async (data, taskId) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/submitFile/${taskId}`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const submitTask = async (data_, taskId) => {
	const data = JSON.stringify({
		description: data_,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/submit/${taskId}`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const studentSpecificCourse = async (_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/specificCourse/${_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const studentTeamOfCourse = async (_id) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/team/${_id}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const studentUpdateTeam = async (
	registered_course_id,
	title,
	description
) => {
	const data = JSON.stringify({
		title: title,
		description: description,
	});
	const headers = {
		"x-auth-token": token,
		"Content-Type": "application/json",
	};
	try {
		const res = await trackPromise(
			Axios.post(`${baseURL}/projectDes/${registered_course_id}`, data, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addCommentStudent = async (taskId, comment) => {
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

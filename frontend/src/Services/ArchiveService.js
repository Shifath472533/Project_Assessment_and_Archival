import Axios from "axios";
import { trackPromise } from "react-promise-tracker";

const baseURL = "http://localhost:5000/api/archive";
const token = localStorage.getItem("token");

export const submitProject = async (
	title,
	description,
	year,
	course_id,
	team_id,
	tag
) => {
	const data = JSON.stringify({
		title: title,
		description: description,
		year: year,
		course_id: course_id,
		team_id: team_id,
		tag: tag,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const submitProjectFile = async (projectId, formData) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/${projectId}`, formData, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getAllProjects = async (course_id, year) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/projects/${course_id}/${year}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getYearBasedCourse = async (year) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/courses/${year}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getAllTeams = async (course_id, year) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/teams/${course_id}/${year}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

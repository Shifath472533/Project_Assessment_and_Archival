import Axios from "axios";
import { trackPromise } from "react-promise-tracker";
const baseURL = "http://localhost:5000/api/offices";
const token = localStorage.getItem("token");

export const getAllCourses = async () => {
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

export const getAllRunningCourses = async () => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/running_courses`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getSpecificCourse = async (code) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/course/${code}`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getAllTeachers = async () => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await trackPromise(
			Axios.get(`${baseURL}/teacher`, {
				headers,
			})
		);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getSessionBasedStudent = async (session) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await Axios.get(`${baseURL}/student/${session}`, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getSemesterBasedCourse = async (semester) => {
	const headers = {
		"x-auth-token": token,
	};
	try {
		const res = await Axios.get(`${baseURL}/courseSemester/${semester}`, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addCourse = async (title, code, semester, credit, details) => {
	const data = JSON.stringify({
		title: title,
		code: code,
		semester: semester,
		credit: credit,
		description: details,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/course/add`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const removeCourse = async (code) => {
	const data = JSON.stringify({
		code: code,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.delete(`${baseURL}/course/remove`, {
			headers,
			data,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const updateCourse = async (
	title,
	code,
	credit,
	semester,
	description
) => {
	const data = JSON.stringify({
		title: title,
		code: code,
		credit: credit,
		semester: semester,
		description: description,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/course/update`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addTeacher = async (
	username,
	name,
	designation,
	dob,
	email,
	githubusername
) => {
	const data = JSON.stringify({
		username: username,
		name: name,
		designation: designation,
		dob: dob,
		email: email,
		githubusername: githubusername,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/teacher/add`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addTeacherCSV = async (data) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/teacher/addCSV`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const deleteTeacher = async (id, username) => {
	const data = JSON.stringify({
		_id: id,
		username: username,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.delete(`${baseURL}/teacher/delete`, {
			headers,
			data,
		});
		return res.data;
	} catch (error) {
		console.log(error);
		return error.response.data;
	}
};

export const assignTeacherCourse = async (course_id, teacher_id, year) => {
	const data = JSON.stringify({
		course_id: course_id,
		teacher_id: teacher_id,
		year: year,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/teacher/assign_course`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const unassignTeacherCourse = async (course_id, teacher_id, year) => {
	const data = JSON.stringify({
		course_id: course_id,
		teacher_id: teacher_id,
		year: year,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(
			`${baseURL}/teacher/unassign_course`,
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

export const updateTeacher = async (
	username,
	name,
	designation,
	dob,
	email,
	githubusername
) => {
	const data = JSON.stringify({
		username: username,
		name: name,
		designation: designation,
		dob: dob,
		email: email,
		githubusername: githubusername,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/teacher/update`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addStudent = async (
	username,
	name,
	session,
	dob,
	email,
	githubusername
) => {
	const data = JSON.stringify({
		username: username,
		name: name,
		session: session,
		dob: dob,
		email: email,
		githubusername: githubusername,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/student/add`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const addStudentCSV = async (data) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/student/addCSV`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const deleteStudent = async (id, username) => {
	const data = JSON.stringify({
		_id: id,
		username: username,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.delete(`${baseURL}/student/delete`, {
			headers,
			data,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export const registerStudentCourse = async (course_code, username, year) => {
	const data = JSON.stringify({
		course_id: course_code,
		username: username,
		year: year,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(
			`${baseURL}/student/register_course`,
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

export const registerStudentCourseCSV = async (data) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(
			`${baseURL}/student/register_courseCSV`,
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

export const unregisterStudentCourse = async (
	assigned_course_id,
	student_username
) => {
	const data = JSON.stringify({
		assigned_course_id: assigned_course_id,
		student_username: student_username,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(
			`${baseURL}/student/unregister_course`,
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

export const updateStudent = async (
	username,
	name,
	dob,
	email,
	githubusername
) => {
	const data = JSON.stringify({
		username: username,
		name: name,
		dob: dob,
		email: email,
		githubusername: githubusername,
	});
	const headers = {
		"Content-Type": "application/json",
		"x-auth-token": token,
	};
	try {
		const res = await Axios.post(`${baseURL}/student/update`, data, {
			headers,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

import Axios from "axios";
import { trackPromise } from "react-promise-tracker";
const baseURL = "http://localhost:5000/api/users";

export const getStudentProfile = async (user_id) => {
  const headers = {
    "x-auth-token": "token-from-localStorage",
  };
  try {
    const res = await trackPromise(
      Axios.get(`${baseURL}/student/profile/${user_id}`, {
        headers,
      })
    );
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getTeacherProfile = async (user_id) => {
  const headers = {
    "x-auth-token": "token-from-localStorage",
  };
  try {
    const res = await trackPromise(
      Axios.get(`${baseURL}/teacher/profile/${user_id}`, {
        headers,
      })
    );
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

import Axios from "axios";
import { trackPromise } from "react-promise-tracker";
const baseURL = "http://localhost:5000/api/auth";

export const login = async (username, password) => {
  const data = JSON.stringify({ username: username, password: password });
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const res = await Axios.post(`${baseURL}/login`, data, {
      headers,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const authentication = async () => {
  const headers = {
    "x-auth-token": localStorage.getItem("token"),
  };
  try {
    const res = await trackPromise(
      Axios.get(`${baseURL}`, {
        headers,
      })
    );
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

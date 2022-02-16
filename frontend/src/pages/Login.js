import React, { useState } from "react";
import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import CardFooter from "@material-tailwind/react/CardFooter";
import H5 from "@material-tailwind/react/Heading5";
import InputIcon from "@material-tailwind/react/InputIcon";
import Button from "@material-tailwind/react/Button";
import Container from "components/login/Container";
import "../components/loader/Loader.css";
import { login, authentication } from "../Services/AuthService";
import { ToastContainer, toast } from "react-toastify";

toast.configure();

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const setHomeDirectory = (userType) => {
    if (userType === "student") {
      // props.history.replace("/student_home");
      setTimeout(function () {
        setShowLoading(false);
      }, 1000);
      window.location = "/student_home";
    } else if (userType === "teacher") {
      // props.history.replace("/teacher_home");
      setTimeout(function () {
        setShowLoading(false);
      }, 1000);
      window.location = "/teacher_home";
    } else if (userType === "office") {
      // props.history.replace("/office_home");
      setTimeout(function () {
        setShowLoading(false);
      }, 1000);
      window.location = "/office_home";
    }
  };
  const routeChange = async (event) => {
    event.preventDefault();
    console.log(username, password);
    if (username.trim() === "" || password.trim() === "") {
      toast.error("Username and password cannot be empty");
      setUsername("");
      setPassword("");
      return;
    }
    setShowLoading(true);
    // const success, msg, token;
    // try {
    //   const { succ, msg_, data: tok } = await login(username, password);
    //   success = succ;
    //   msg = msg_;
    //   token = tok;
    //   console.log(success, msg, token);
    // } catch (ex) {
    //   // window.location = "/";
    // }

    const { success, msg, data: token } = await login(username, password);
    console.log(success, msg, token);

    if (success) {
      localStorage.setItem("token", token);
      const { data } = await authentication();
      console.log(data);
      // const { _id, role, username } = data;
      // console.log(_id, role, username);
      localStorage.setItem("_id", data._id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      console.log(localStorage.getItem("role"));
      // setTimeout(function () {
      setHomeDirectory(data.role);
      // setShowLoading(false);
      // }, 1000);
    } else {
      setUsername("");
      setPassword("");
      // window.location = "/";
      setShowLoading(false);
      toast.error("Unable to login");
    }
  };
  return (
    <div>
      <div
        className={
          showLoading === true
            ? "w-full h-screen bg-gray-200 flex flex-row justify-center items-center"
            : "hidden"
        }>
        <span className="loader"></span>
      </div>
      <Container className={showLoading === false ? "" : "hidden"}>
        <Card>
          <CardHeader color="lightBlue">
            <H5 color="white" style={{ marginBottom: 0 }}>
              Sign in
            </H5>
          </CardHeader>

          <CardBody>
            <div className="mb-12 px-4 bg-bb">
              <InputIcon
                required
                type="text"
                color="lightBlue"
                placeholder="Username"
                iconName="account_circle"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="mb-8 px-4">
              <InputIcon
                required
                type="password"
                color="lightBlue"
                placeholder="Password"
                iconName="lock"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex justify-center bg-bb">
              <Button
                type="submit"
                value="Submit"
                color="lightBlue"
                buttonType="link"
                size="lg"
                ripple="dark"
                onClick={(event) => routeChange(event)}>
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Container>
      <ToastContainer
        toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        bodyClassName="text-sm font-white font-med block p-3"
        position="top-right"
        autoClose="3000"
      />
    </div>
  );
}

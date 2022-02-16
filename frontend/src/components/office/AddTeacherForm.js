import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { useLocation, useHistory } from "react-router-dom";
import Card from "@material-tailwind/react/Card";
// import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import CardFooter from "@material-tailwind/react/CardFooter";
// import H5 from "@material-tailwind/react/Heading5";
import Input from "@material-tailwind/react/Input";
import Button from "@material-tailwind/react/Button";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { addTeacher } from "../../Services/OfficeService";
import FormatDate from "../../utilityFuctions/FormatDate";
import "../../components/loader/Loader6.css";
import { ToastContainer, toast } from "react-toastify";

toast.configure();
// import { setEmitFlags } from "typescript";
// import { SettingsSystemDaydreamOutlined } from "@material-ui/icons";

export default function AddTeacherForm(props) {
  const history = useHistory();
  const [designation, setDesignation] = useState("Select");
  const [username, setUsername] = useState("");
  const [name, setFullname] = useState("");
  const [dob, setDob] = useState(new Date());
  const [email, setEmail] = useState("");
  const [githubusername, setGithub] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleChange = (event) => {
    setDesignation(event.target.value);
  };

  const handleDateChange = (date) => {
    setDob(date);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleFullname = (event) => {
    setFullname(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleGithub = (event) => {
    setGithub(event.target.value);
  };

  const handleSubmit = async () => {
    setDesignation("Select");
    setUsername("");
    setFullname("");
    setDob(new Date());
    setEmail("");
    setGithub("");
    setShowLoading(true);
    console.log(designation, username, name, email, githubusername, dob);
    const { success, msg, data } = await addTeacher(
      username,
      name,
      designation,
      FormatDate(dob),
      email,
      githubusername
    );
    console.log(success, msg, data);
    setShowLoading(false);
    if (success) {
      toast.success(" Added Teacher Information successfully");
    } else {
      toast.error(" Unable to Add Teacher Information");
    }
    history.push({
      pathname: "/add_teacher",
      // search: "?query=abc",
      state: { success: success, msg: msg },
    });
  };
  return (
    <div className="w-full flex flex-col">
      {showLoading && (
        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
          <span className="loader6"></span>
        </div>
      )}
      <div className="w-full flex flex-row justify-between my-1 sm:my-10 items-center">
        <Card className="w-full border-t-4 mx-10 lg:mx-20">
          <CardBody>
            <div className="mb-10 px-4">
              <Input
                type="text"
                color="lightBlue"
                size="lg"
                outline={true}
                placeholder="Username"
                value={username}
                onChange={(e) => handleUsername(e)}
              />
            </div>
            <div className="mb-10 px-4">
              <Input
                type="text"
                color="lightBlue"
                size="lg"
                outline={true}
                placeholder="Full Name"
                value={name}
                onChange={(e) => handleFullname(e)}
              />
            </div>
            <div className="mb-10 px-4 flex flex-row justify-around items-center">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  inputVariant="outlined"
                  label="Date of birth"
                  format="yyyy/MM/dd"
                  value={dob}
                  onChange={handleDateChange}
                  animateYearScrolling
                />
              </MuiPickersUtilsProvider>
              <FormControl variant="outlined">
                <InputLabel id="designation">Designation</InputLabel>
                <Select
                  labelId="designation"
                  id="designation"
                  value={designation}
                  onChange={handleChange}
                  label="Designation">
                  <MenuItem value={"Lecturer"}>Lecturer</MenuItem>
                  <MenuItem value={"Assistant Professor"}>
                    Assistant Professor
                  </MenuItem>
                  <MenuItem value={"Associate Professor"}>
                    Associate Professor
                  </MenuItem>
                  <MenuItem value={"Professor"}>Professor</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="mb-10 px-4">
              <Input
                type="email"
                color="lightBlue"
                size="lg"
                outline={true}
                placeholder="Email"
                value={email}
                onChange={(e) => handleEmail(e)}
              />
            </div>
            <div className="mb-10 px-4">
              <Input
                type="link"
                color="lightBlue"
                size="lg"
                outline={true}
                placeholder="Github Username"
                value={githubusername}
                onChange={(e) => handleGithub(e)}
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex justify-center">
              <Button
                color="teal"
                buttonType="filled"
                size="lg"
                ripple="dark"
                onClick={handleSubmit}>
                Add Teacher
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

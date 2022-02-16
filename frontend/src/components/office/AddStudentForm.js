import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { useLocation, useHistory } from "react-router-dom";
import Card from "@material-tailwind/react/Card";
import CardBody from "@material-tailwind/react/CardBody";
import CardFooter from "@material-tailwind/react/CardFooter";
import Input from "@material-tailwind/react/Input";
import Button from "@material-tailwind/react/Button";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { addStudent } from "../../Services/OfficeService";
import FormatDate from "../../utilityFuctions/FormatDate";
import "../../components/loader/Loader6.css";
import { toast } from "react-toastify";

toast.configure();
export default function AddStudentForm(props) {
  const history = useHistory();
  const [session, setSession] = useState("Select");
  const [sessionList, setSessionList] = useState(["2016-17"]);
  const [name, setFullname] = useState("");
  const [dob, setDob] = useState(new Date());
  const [email, setEmail] = useState("");
  const [githubusername, setGithub] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    let sessList = [];
    for (let i = currentYear; i >= currentYear - 4; i--) {
      sessList.push(`${i - 1}-${i - 2000}`);
    }
    console.log(sessList);
    setSessionList(sessList);
  }, []);

  const handleChange = (event) => {
    setSession(event.target.value);
  };

  //   const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setDob(date);
  };

  const [username, setUsername] = useState("");
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

  const handleSubmit = async (e) => {
    setSession("Select");
    setUsername("");
    setFullname("");
    setDob(new Date());
    setEmail("");
    setGithub("");
    setShowLoading(true);
    // console.log(
    //   username,
    //   name,
    //   session,
    //   FormatDate(dob),
    //   email,
    //   githubusername
    // );
    //DO THE JOB NEED TO BE DONE
    const { success, msg, data } = await addStudent(
      username,
      name,
      session,
      FormatDate(dob),
      email,
      githubusername
    );
    console.log(success, msg, data);
    setShowLoading(false);
    if (success) {
      toast.success(" Added Student Information successfully");
    } else {
      toast.error(" Unable to Add Student Information");
    }
    history.replace({
      pathname: "/add_student",
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
        <Card className="w-full border-t-4 mx-1 sm:mx-10 lg:mx-20">
          <CardBody>
            <div className="mb-10 px-4">
              <Input
                type="text"
                color="teal"
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
                color="teal"
                size="lg"
                outline={true}
                placeholder="Full Name"
                value={name}
                onChange={(e) => handleFullname(e)}
              />
            </div>
            <div className="mb-10 ml-4 mr-10 flex flex-col sm:flex-row justify-around items-center">
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
              {/* <div className="w-full h-full flex flex-row justify-center items-center text-2xl text-gray-600 z-50">
              <span className="loader6"></span>
            </div> */}
              <FormControl ClassName=" w-full mt-5" variant="outlined">
                <InputLabel id="session">Session</InputLabel>
                <Select
                  labelId="session"
                  id="session"
                  value={session}
                  onChange={handleChange}
                  label="Session">
                  {sessionList.map((sess) => {
                    return <MenuItem value={sess}>{sess}</MenuItem>;
                  })}
                  {/* <MenuItem value={2016 - 17}>2016-17</MenuItem>
                <MenuItem value={2017 - 18}>2017-18</MenuItem>
                <MenuItem value={2018 - 19}>2018-19</MenuItem>
                <MenuItem value={2019 - 20}>2019-20</MenuItem>
                <MenuItem value={2020 - 21}>2020-21</MenuItem> */}
                </Select>
              </FormControl>
            </div>
            <div className="mb-10 px-4">
              <Input
                type="email"
                color="teal"
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
                color="teal"
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
                Add Student
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

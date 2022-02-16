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
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { addCourse } from "../../Services/OfficeService";
import Textarea from "@material-tailwind/react/Textarea";
import "../../components/loader/Loader6.css";
// import FormatDate from "../../utilityFuctions/FormatDate";
import { ToastContainer, toast } from "react-toastify";

toast.configure();

export default function AddCourseForm() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const [code, setCode] = useState("");

  const handleCode = (event) => {
    setCode(event.target.value);
  };

  const [details, setDetails] = useState("");

  const handleDetails = (event) => {
    setDetails(event.target.value);
  };

  const [semester, setSemester] = useState("select");

  const handleSemester = (event) => {
    setSemester(event.target.value);
  };

  const [credit, setCredit] = useState("select");

  const handleCredit = (event) => {
    setCredit(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSemester("Select");
    setCredit("Select");
    setTitle("");
    setCode("");
    setDetails("");
    setShowLoading(true);
    console.log(title, code, semester, credit, details);
    const { success, msg, data } = await addCourse(
      title,
      code,
      semester,
      credit,
      details
    );
    console.log(success, msg, data);
    setShowLoading(false);
    if (success) {
      toast.success(" Added Course successfully");
    } else {
      toast.error(" Unable to Add Course");
    }
    history.push({
      pathname: "/add_course",
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
                placeholder="Course Title"
                name="title"
                value={title}
                onChange={(e) => handleTitle(e)}
              />
            </div>
            <div className="mb-10 px-4">
              <Input
                type="text"
                color="teal"
                size="lg"
                outline={true}
                placeholder="Course Code"
                name="code"
                value={code}
                onChange={(e) => handleCode(e)}
              />
            </div>
            <div className="mb-10 px-4">
              <Textarea
                color="lightBlue"
                size="regular"
                outline={true}
                placeholder="Course Details"
                name="details"
                value={details}
                onChange={(e) => handleDetails(e)}
              />
            </div>
            <div className="mb-10 flex flex-col sm:flex-row justify-around items-center">
              <FormControl ClassName=" w-full mt-5" variant="outlined">
                <InputLabel id="">Semester</InputLabel>
                <Select
                  labelId="Semester"
                  id="Semester"
                  name="semester"
                  value={semester}
                  onChange={handleSemester}
                  label="Semester">
                  <MenuItem value={"1"}>1/1</MenuItem>
                  <MenuItem value={"2"}>1/2</MenuItem>
                  <MenuItem value={"3"}>2/1</MenuItem>
                  <MenuItem value={"4"}>2/2</MenuItem>
                  <MenuItem value={"5"}>3/1</MenuItem>
                  <MenuItem value={"6"}>3/2</MenuItem>
                  <MenuItem value={"7"}>4/1</MenuItem>
                  <MenuItem value={"8"}>4/2</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="mb-10 flex flex-col sm:flex-row justify-around items-center">
              <FormControl ClassName=" w-full mt-5" variant="outlined">
                <InputLabel id="Credit">Credit</InputLabel>
                <Select
                  labelId="Credit"
                  id="Credit"
                  name="credit"
                  value={credit}
                  onChange={handleCredit}
                  label="Credit">
                  <MenuItem value={"1"}>1</MenuItem>
                  <MenuItem value={"1.5"}>1.5</MenuItem>
                  <MenuItem value={"2"}>2</MenuItem>
                  <MenuItem value={"2.5"}>2.5</MenuItem>
                  <MenuItem value={"3"}>3</MenuItem>
                  <MenuItem value={"3.5"}>3.5</MenuItem>
                  <MenuItem value={"4"}>4</MenuItem>
                </Select>
              </FormControl>
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
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

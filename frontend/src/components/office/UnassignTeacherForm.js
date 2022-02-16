import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { useLocation, useHistory } from "react-router-dom";
import Card from "@material-tailwind/react/Card";
// import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import CardFooter from "@material-tailwind/react/CardFooter";
// import H5 from "@material-tailwind/react/Heading5";
// import Input from "@material-tailwind/react/Input";
import Button from "@material-tailwind/react/Button";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { unassignTeacherCourse } from "Services/OfficeService";
// import { getAllCourses } from "Services/OfficeService";
import { getAllTeachers, getSemesterBasedCourse } from "Services/OfficeService";
import "../../components/loader/Loader6.css";
// import FormatDate from "../../utilityFuctions/FormatDate";
import { ToastContainer, toast } from "react-toastify";

toast.configure();
export default function UnassignTeacherForm() {
  const history = useHistory();
  const [year, setYear] = useState("Select");
  const [years, setYears] = useState([]);
  const [semester, setSemester] = useState("select");
  const [semesters, setSemesters] = useState([
    { sem: "1/1", val: "1" },
    { sem: "1/2", val: "2" },
    { sem: "2/1", val: "3" },
    { sem: "2/2", val: "4" },
    { sem: "3/1", val: "5" },
    { sem: "3/2", val: "6" },
    { sem: "4/1", val: "7" },
    { sem: "4/2", val: "8" },
  ]);
  const [courses, setCourses] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseCode, setCourseCode] = useState("select");
  const [courseCodeDisabled, setCourseCodeDisabled] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [teacherIdDisabled, setTeacherIdDisabled] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    let yrs = [];
    for (let i = currentYear; i > 2016; i--) {
      yrs.push(`${i}`);
    }
    setYears(yrs);
    // setSemesters([
    //   { sem: "1/1", val: "1" },
    //   { sem: "1/2", val: "2" },
    //   { sem: "2/1", val: "3" },
    //   { sem: "2/2", val: "4" },
    //   { sem: "3/1", val: "5" },
    //   { sem: "3/2", val: "6" },
    //   { sem: "4/1", val: "7" },
    //   { sem: "4/2", val: "8" },
    // ]);
    async function fetchData() {
      const { success, msg, data } = await getAllTeachers();
      console.log(success, msg, data);
      setTeachers(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (teachers.length > 0) {
      setTeacherIdDisabled(false);
    } else {
      setTeacherIdDisabled(true);
    }
  }, [teachers]);

  useEffect(() => {
    if (semester) {
      async function fetchData() {
        const { success, msg, data } = await getSemesterBasedCourse(semester);
        console.log(success, msg, data);
        setCourses(data);
        /* const { success, msg, data } = await getAllCourses();
        console.log(success, msg, data); */
      }
      fetchData();
    }
  }, [semester]);

  useEffect(() => {
    if (courses.length > 0) {
      setCourseCodeDisabled(false);
    } else {
      setCourseCodeDisabled(true);
    }
  }, [courses]);

  const handleYearChange = (event) => {
    console.log(event.target.value);
    setYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    console.log(event.target.value);
    setSemester(event.target.value);
  };

  const handleCourseCodeChange = (event) => {
    console.log(event.target.value);
    setCourseCode(event.target.value);
  };

  const [teacher_id, setTeacherId] = useState("select");

  const handleTeacherId = (event) => {
    setTeacherId(event.target.value);
  };

  // const [teachers, setTeachers] = useState([]);

  const handleTeachers = (event) => {
    setTeachers(event.target.value);
  };

  const resetFields = () => {
    setYear("Select");
    setCourseCode("select");
    setSemester("select");
    setTeacherId("select");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { courseCode, teacher_id, year };
    console.log(dataToSubmit);
    resetFields();
    setShowLoading(true);
    //DO THE JOB NEED TO BE DONE
    console.log(courseCode, teacher_id, year);
    const { success, msg, data } = await unassignTeacherCourse(dataToSubmit);
    console.log(success, msg, data);
    if (success) {
      console.log(msg);
      toast.success(" Unassigned Teacher successfully");
    } else {
      console.log(msg);
      toast.error(" Unable to unassign Teacher");
    }
    setShowLoading(false);
    history.push({
      pathname: "/assign_teacher",
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
            <div className="mb-10 flex flex-row sm:flex-row justify-around items-center">
              <FormControl ClassName=" w-full mt-5" variant="outlined">
                <InputLabel id="Semester">Semester</InputLabel>
                <Select
                  labelId="Semester"
                  id="Semester"
                  value={semester}
                  onChange={handleSemesterChange}
                  label="Semester">
                  {semesters.map((semester_) => {
                    return (
                      <MenuItem key={semester_.val} value={semester_.val}>
                        {semester_.sem}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                ClassName=" w-full mt-5"
                variant="outlined"
                disabled={courseCodeDisabled}>
                <InputLabel id="CourseCode">CourseCode</InputLabel>
                <Select
                  labelId="CourseCode"
                  id="CourseCode"
                  value={courseCode}
                  onChange={handleCourseCodeChange}
                  label="CourseCode">
                  {courses.map((course_) => {
                    return (
                      <MenuItem key={course_._id} value={course_._id}>
                        {course_.code}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            {/* <div className="mb-10 px-4">
            <Input
              type="text"
              color="teal"
              size="lg"
              outline={true}
              placeholder="Teacher ID"
              value={teacher_id}
              onChange={(e) => handleTeacherId(e)}
            />
          </div> */}
            <div className="mb-10 flex flex-row sm:flex-row justify-around items-center">
              <FormControl
                ClassName=" w-full mt-5"
                variant="outlined"
                disabled={teacherIdDisabled}>
                <InputLabel id="Teacher ID">Teacher</InputLabel>
                <Select
                  labelId="Teacher ID"
                  id="Teacher ID"
                  value={teacher_id}
                  onChange={handleTeacherId}
                  label="Teacher ID">
                  {teachers.map((teacher_) => {
                    return (
                      <MenuItem key={teacher_._id} value={teacher_._id}>
                        {teacher_.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl ClassName=" w-full mt-5" variant="outlined">
                <InputLabel id="Year">Year</InputLabel>
                <Select
                  labelId="Year"
                  id="Year"
                  value={year}
                  onChange={handleYearChange}
                  label="Year">
                  {years.map((year_) => {
                    return (
                      <MenuItem key={year_} value={year_}>
                        {year_}
                      </MenuItem>
                    );
                  })}
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

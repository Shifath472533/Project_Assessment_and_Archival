import React, { useEffect, useState } from "react";
import CourseCard from "components/archive/CourseCard";
import { teacherAllCourse } from "Services/TeacherService";
import NavbarComponent from "../../components/common/NavbarComponent";
import { useLocation, useHistory } from "react-router-dom";
// import { getYearBasedCourse } from "Services/ArchiveService";
import { usePromiseTracker } from "react-promise-tracker";
// import { trackPromise } from "react-promise-tracker";
import "../../components/loader/Loader2.css";

export default function TeacherCourse(props) {
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [type, setType] = useState([]);
  const [courses, setCourses] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const semColors = [
    "pink",
    "orange",
    "purple",
    "blue",
    "green",
    "cyan",
    "indigo",
    "teal",
  ];
  const semDict = {
    1: { sem: "1/1", color: "pink" },
    2: { sem: "1/2", color: "orange" },
    3: { sem: "2/1", color: "purple" },
    4: { sem: "2/2", color: "blue" },
    5: { sem: "3/1", color: "green" },
    6: { sem: "3/2", color: "cyan" },
    7: { sem: "4/1", color: "indigo" },
    8: { sem: "4/2", color: "teal" },
  };
  useEffect(() => {
    try {
      console.log(location.pathname);
      console.log(location.search);
      console.log(location.state.type);
      setType(location.state.type);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);

  const handleClick = (course) => {
    history.push({
      pathname: "/teacher_teams",
      // search: "?query=abc",
      state: { course: course },
    });
  };

  useEffect(() => {
    async function fetchData() {
      const { success, msg, data } = await teacherAllCourse();
      if (type === "running") {
        console.log(type, success, msg, data, data.Active_Courses);
        if (success && data) {
          setCourses(data.Active_Courses);
        }
      } else if (type === "completed") {
        console.log(type, success, msg, data.Inactive_Courses);
        if (success && data) {
          setCourses(data.Inactive_Courses);
        }
      }
    }
    fetchData();
  }, [type]);

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <div className="container mt-20">
            <div className="my-5 px-3 md:px-8">
              {!courses.length && (
                <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                  {/* No Courses to show */}
                  {promiseInProgress && (
                    // <h1>Hey some async call in progress ! </h1>
                    <span className="loader2"></span>
                  )}
                </div>
              )}
              <div className="container mx-auto max-w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">
                  {courses.map((course) => {
                    return (
                      <CourseCard
                        color={semDict[course.semester].color}
                        icon={semDict[course.semester].sem}
                        title={course.title}
                        amount={course.code}
                        percentage=""
                        percentageIcon=""
                        percentageColor=""
                        date=""
                        onClick_={() => handleClick(course)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

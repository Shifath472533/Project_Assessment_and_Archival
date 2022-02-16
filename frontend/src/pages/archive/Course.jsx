import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import CourseCard from "components/archive/CourseCard";
import NavbarComponent from "../../components/common/NavbarComponent";
import { getYearBasedCourse } from "../../Services/ArchiveService";
import { usePromiseTracker } from "react-promise-tracker";
import "../../components/loader/Loader2.css";

export default function Course(props) {
  const location = useLocation();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [year, setYear] = useState(0);
  const { promiseInProgress } = usePromiseTracker();
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
    try{
      console.log(location.pathname);
    console.log(location.state.session);
    setYear(location.state.session);
    }
    catch(e){
      window.location="/";
    }
  }, [location]);
  const handleClick = (course) => {
    console.log(course);
    history.push({
      pathname: "/project",
      // search: "?query=abc",
      state: { course: course, year: year },
    });
  };
  useEffect(() => {
    if (year) {
      async function fetchData() {
        console.log("year ", year);
        const { success, msg, data } = await getYearBasedCourse(year);
        console.log(success, msg, data);
        setCourses(data);
      }
      fetchData();
    }
  }, [year]);
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
                  {courses &&
                    courses.map((course) => {
                      return (
                        <CourseCard
                          color={semDict[course.semester].color}
                          icon={semDict[course.semester].sem}
                          key={course.code}
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

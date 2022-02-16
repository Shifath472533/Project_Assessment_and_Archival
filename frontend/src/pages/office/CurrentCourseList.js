import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getAllRunningCourses } from "Services/OfficeService";
import CurrentCourseTable from "../../components/office/CurrentCourseTable";
import Paginate from "../../utilityFuctions/Paginate";
import NavbarComponent from "../../components/common/NavbarComponent";

export default function RunningCourseList(props) {
  const location = useLocation();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [courseList, setCourseList] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [eachCourse, setEachCourse] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { success, msg, data } = await getAllRunningCourses();
      console.log(success, msg, data);
      if (success && data) {
        setCourseList(data);
        console.log("Current course data: ", data);
        setCourseDetails(
          data.map((row) => {
            return row.courseDetails;
          })
        );
        setEachCourse(
          data.map((row) => {
            return row.eachCourse;
          })
        );
        console.log(success, msg, data);
      }
    }
    fetchData();
  }, []);
  const [headers, setHeaders] = useState([
    "Course code",
    "Title",
    "Semester",
    "Year",
  ]);
  const [itemsCount, setItemsCount] = useState(courseDetails.length);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleClick = (row) => {
    console.log(row);
    history.push({
      pathname: "/current_course_details",
      // search: "?query=abc",
      state: { details: row },
    });
  };

  const pageCourseList = Paginate(courseList, currentPage, pageSize);
  const pageCourseDetails = Paginate(courseDetails, currentPage, pageSize);
  const pageEachCourse = Paginate(eachCourse, currentPage, pageSize);

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />

          <>
            <div className="px-3 mt-20 sm:mx-5 lg:mx-20 md:px-8 h-auto">
              <div className="container mx-auto max-w-full">
                <div className="flex flex-row">
                  <CurrentCourseTable
                    headers={headers}
                    courseList={courseList}
                    data={courseDetails}
                    itemsCount={itemsCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    setPageSize={setPageSize}
                    handleClick={handleClick}
                  />
                </div>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
}

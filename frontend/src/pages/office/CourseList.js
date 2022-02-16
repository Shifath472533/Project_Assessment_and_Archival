import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getAllCourses } from "Services/OfficeService";
import CourseTable from "../../components/office/CourseTable";
import Paginate from "../../utilityFuctions/Paginate";
import NavbarComponent from "../../components/common/NavbarComponent";
import "../../components/loader/Loader6.css";
import { removeCourse } from "Services/OfficeService";
import DeleteCourseModal from "../../components/office/DeleteCourseModal";

export default function CourseList(props) {
  const location = useLocation();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [courseList, setCourseList] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [itemsCount, setItemsCount] = useState(courseList.length);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [courseToBeDeleted, setCourseToBeDeleted] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { success, msg, data } = await getAllCourses();
      console.log(success, msg, data);
      if (success && data) {
        setCourseList(data);
        setItemsCount(data.length);
      }
    }
    fetchData();
  }, []);
  const [headers, setHeaders] = useState([
    "Course code",
    "Title",
    "Semester",
    "Delete",
  ]);

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleClick = (row) => {
    console.log(row);
    history.push({
      pathname: "/course_details",
      // search: "?query=abc",
      state: { details: row },
    });
  };

  const handleCourseDeleteModal = (course) => {
    setCourseToBeDeleted(course);
    setShowDeleteCourseModal(true);
    console.log(course);
  };

  const handleCourseDelete = async (row) => {
    console.log(row._id, row.code);
    navigator.clipboard.writeText(row.code);
    setShowDeleteCourseModal(false);
    // setTabLoading(true);
    // const { success, msg, data } = await removeCourse(row.code);
    // console.log(success, msg, data);
    // setTabLoading(false);
    // window.location.href = "/course_list";
  };

  const pageStudents = Paginate(courseList, currentPage, pageSize);
  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <>
            <div className="px-3 mt-20 sm:mx-5 lg:mx-20 md:px-8 h-auto">
              <DeleteCourseModal
                courseToBeDeleted={courseToBeDeleted}
                handleCourseDelete={handleCourseDelete}
                showDeleteCourseModal={showDeleteCourseModal}
                setShowDeleteCourseModal={setShowDeleteCourseModal}
              />
              <div className="container mx-auto max-w-full">
                <div className="flex flex-row">
                  <CourseTable
                    headers={headers}
                    data={pageStudents}
                    itemsCount={itemsCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    setPageSize={setPageSize}
                    handleClick={handleClick}
                    tabLoading={tabLoading}
                    handleCourseDelete={handleCourseDelete}
                    courseToBeDeleted={courseToBeDeleted}
                    handleCourseDeleteModal={handleCourseDeleteModal}
                    showDeleteCourseModal={showDeleteCourseModal}
                    setShowDeleteCourseModal={setShowDeleteCourseModal}
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

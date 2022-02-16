import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  getSessionBasedStudent,
  deleteStudent,
} from "../../Services/OfficeService";
import StudentTable from "../../components/office/StudentTable";
import Paginate from "../../utilityFuctions/Paginate";
import NavbarComponent from "../../components/common/NavbarComponent";
import "../../components/loader/Loader6.css";
import DeleteStudentModal from "../../components/office/DeleteStudentModal";

export default function StudentList(props) {
  const location = useLocation();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [studentList, setStudentList] = useState([]);
  const [session, setSession] = useState("");
  const headers = ["Registration No", "Name", "Session", "Delete"];
  const [itemsCount, setItemsCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoading, setShowLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [foundData, setFoundData] = useState("none");
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [studentToBeDeleted, setStudentToBeDeleted] = useState([]);

  useEffect(() => {
    try {
      // console.log(location.pathname);
      // console.log(location.search);
      console.log(location.state.session);
      setSession(location.state.session);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);
  useEffect(() => {
    if (session.length) {
      async function fetchData() {
        const { success, msg, data } = await getSessionBasedStudent(session);
        console.log(success, msg, data);
        if (success && data) {
          setStudentList(data);
          setItemsCount(data.length);
          setShowLoading(false);
          setFoundData("found");
        } else {
          setFoundData("not found");
        }
      }
      fetchData();
    }
  }, [session]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleClick = (row) => {
    // console.log(row);
    history.push({
      pathname: "/student_profile",
      // search: "?query=abc",
      state: { profile: row },
    });
  };

  const handleStudentDeleteModal = (student) => {
    setStudentToBeDeleted(student);
    setShowDeleteStudentModal(true);
    console.log(student);
  };

  const handleStudentDelete = async (row) => {
    // console.log(row._id, row.username);
    setShowDeleteStudentModal(false);
    setTabLoading(true);
    const { success, msg, data } = await deleteStudent(row._id, row.username);
    console.log(success, msg, data);
    setTabLoading(false);
    window.location.href = "/student_list";
  };
  const pageStudents = Paginate(studentList, currentPage, pageSize);
  // console.log("studentList ", studentList);
  // console.log("pageStudents", pageStudents);
  // console.log(currentPage);
  // console.log(pageSize);
  // console.log(itemsCount);
  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <>
            <div className="px-3 mt-20 sm:mx-5 lg:mx-20 md:px-8 h-auto">
              <DeleteStudentModal
                studentToBeDeleted={studentToBeDeleted}
                handleStudentDelete={handleStudentDelete}
                showDeleteStudentModal={showDeleteStudentModal}
                setShowDeleteStudentModal={setShowDeleteStudentModal}
              />
              <div className="container mx-auto max-w-full">
                <div className="flex flex-row">
                  <StudentTable
                    session={session}
                    headers={headers}
                    data={pageStudents}
                    itemsCount={itemsCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    setPageSize={setPageSize}
                    handleClick={handleClick}
                    handleStudentDelete={handleStudentDelete}
                    studentToBeDeleted={studentToBeDeleted}
                    showDeleteStudentModal={showDeleteStudentModal}
                    setShowDeleteStudentModal={setShowDeleteStudentModal}
                    handleStudentDeleteModal={handleStudentDeleteModal}
                    showLoading={showLoading}
                    tabLoading={tabLoading}
                    foundData={foundData}
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

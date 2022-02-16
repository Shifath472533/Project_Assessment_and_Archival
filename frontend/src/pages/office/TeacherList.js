import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getAllTeachers, deleteTeacher } from "../../Services/OfficeService";
import TeacherTable from "../../components/office/TeacherTable";
import Paginate from "../../utilityFuctions/Paginate";
import NavbarComponent from "../../components/common/NavbarComponent";
import "../../components/loader/Loader6.css";
import DeleteTeacherModal from "../../components/office/DeleteTeacherModal";

export default function TeacherList(props) {
  const location = useLocation();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [teacherList, setTeacherList] = useState([]);
  const headers = ["Code", "Name", "Designation", "Delete"];
  const [itemsCount, setItemsCount] = useState(teacherList.length);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [tabLoading, setTabLoading] = useState(false);
  const [showDeleteTeacherModal, setShowDeleteTeacherModal] = useState(false);
  const [teacherToBeDeleted, setTeacherToBeDeleted] = useState([]);

  useEffect(() => {
    try {
      async function fetchData() {
        const { success, msg, data } = await getAllTeachers();
        console.log(success, msg, data);
        if (success && data) {
          setTeacherList(data);
          setItemsCount(data.length);
        }
      }
      fetchData();
    } catch (e) {
      window.location = "/error_page";
    }
  }, [location]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleClick = (row) => {
    // console.log(row);
    history.push({
      pathname: "/teacher_profile",
      // search: "?query=abc",
      state: { profile: row },
    });
  };

  const handleTeacherDeleteModal = (teacher) => {
    setTeacherToBeDeleted(teacher);
    setShowDeleteTeacherModal(true);
    console.log(teacher);
  };

  const handleTeacherDelete = async (row) => {
    //console.log(row._id, row.username);
    setShowDeleteTeacherModal(false);
    setTabLoading(true);
    async function fetchData() {
      /* try {
        await deleteTeacher(row._id, row.username);
      } catch (error) {
        console.log(error);
      } */
      const { success, msg, data } = await deleteTeacher(row._id, row.username);
      console.log(success, msg, data);
      setTabLoading(false);
    }
    fetchData();
    window.location.href = "/teacher_list";
  };
  const pageTeachers = Paginate(teacherList, currentPage, pageSize);

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <>
            <div className="px-3 mt-20 sm:mx-5 lg:mx-20 md:px-8 h-auto">
              <DeleteTeacherModal
                teacherToBeDeleted={teacherToBeDeleted}
                handleTeacherDelete={handleTeacherDelete}
                showDeleteTeacherModal={showDeleteTeacherModal}
                setShowDeleteTeacherModal={setShowDeleteTeacherModal}
              />
              <div className="container mx-auto max-w-full mb-5">
                <div className="flex flex-row">
                  <TeacherTable
                    headers={headers}
                    data={pageTeachers}
                    itemsCount={itemsCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    setPageSize={setPageSize}
                    handleClick={handleClick}
                    teacherToBeDeleted={teacherToBeDeleted}
                    handleTeacherDelete={handleTeacherDelete}
                    handleTeacherDeleteModal={handleTeacherDeleteModal}
                    showDeleteTeacherModal={showDeleteTeacherModal}
                    setShowDeleteTeacherModal={setShowDeleteTeacherModal}
                    tabLoading={tabLoading}
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

import React from "react";
// import React, { useState } from "react";
import OfficeCard from "components/office/OfficeCard";
import NavbarComponent from "../../components/common/NavbarComponent";
// import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';

export default function OfficeHome(props) {
  const token = localStorage.getItem("token");
  const handleClick = (sec) => {
    switch (sec) {
      case "student":
        props.history.push("/office_student_session");
        break;
      case "teacher":
        props.history.push("/teacher_list");
        break;
      case "course":
        props.history.push("/course_list");
        break;
      case "curr_course":
        props.history.push("/current_course_list");
        break;
      case "manage":
        props.history.push("/management");
        break;
      default:
        console.log("No page found");
    }
  };
  return (
    <>
      <NavbarComponent props={props} />
      {token && (
        <main>
          <div className="pt-16 pb-32 flex content-center items-center justify-center"></div>
          <section className="pb-20 bg-gray-100 -mt-32">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap relative z-50 justify-center ">
                <OfficeCard
                  color="lightBlue"
                  section="student"
                  onClick={handleClick}
                  icon="people"
                  title="Students">
                  {/* Students */}
                </OfficeCard>
                <OfficeCard
                  color="lightBlue"
                  section="teacher"
                  onClick={handleClick}
                  icon="person"
                  title="Teachers">
                  {/* Teachers */}
                </OfficeCard>
                <OfficeCard
                  color="lightBlue"
                  section="course"
                  onClick={handleClick}
                  icon="school"
                  title="Courses">
                  {/* Courses */}
                </OfficeCard>
                <OfficeCard
                  color="lightBlue"
                  section="curr_course"
                  onClick={handleClick}
                  icon="book"
                  title="Current Courses">
                  {/* Courses */}
                </OfficeCard>
                <OfficeCard
                  color="lightBlue"
                  section="manage"
                  onClick={handleClick}
                  icon="settings"
                  title="Management">
                  {/* Courses */}
                </OfficeCard>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

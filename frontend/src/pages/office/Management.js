import React from "react";
// import React, { useState } from "react";
import OfficeCard from "../../components/office/OfficeCard";
import NavbarComponent from "../../components/common/NavbarComponent";

export default function Management(props) {
  const token = localStorage.getItem("token");
  const handleClick = (sec) => {
    switch (sec) {
      case "studentAdd":
        props.history.push("/add_student");
        break;
      case "teacherAdd":
        props.history.push("/add_teacher");
        break;
      case "courseAdd":
        props.history.push("/add_course");
        break;
      case "teacherAsg":
        props.history.push("/assign_teacher");
        break;
      case "studentReg":
        props.history.push("/register_student");
        break;
      default:
        console.log("No page found");
    }
  };
  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <>
            <main>
              <div className="pt-16 pb-32 flex content-center items-center justify-center"></div>
              <section className="pb-20 bg-gray-100 -mt-32">
                <div className="container max-w-7xl mx-auto px-4">
                  <div className="flex flex-wrap relative z-50 justify-center ">
                    <OfficeCard
                      color="deepPurple"
                      section="studentAdd"
                      onClick={handleClick}
                      icon="people"
                      title="Add Student"
                    >
                      {/* Students */}
                    </OfficeCard>
                    <OfficeCard
                      color="deepPurple"
                      section="teacherAdd"
                      onClick={handleClick}
                      icon="person"
                      title="Add Teacher"
                    >
                      {/* Teachers */}
                    </OfficeCard>
                    <OfficeCard
                      color="deepPurple"
                      section="courseAdd"
                      onClick={handleClick}
                      icon="school"
                      title="Add / Remove Course"
                    >
                      {/* Courses */}
                    </OfficeCard>
                    <OfficeCard
                      color="deepPurple"
                      section="studentReg"
                      onClick={handleClick}
                      icon="people"
                      title="Register Student in a course"
                    >
                      {/* Students */}
                    </OfficeCard>
                    <OfficeCard
                      color="deepPurple"
                      section="teacherAsg"
                      onClick={handleClick}
                      icon="person"
                      title="Assign Teacher in a course"
                    >
                      {/* Teachers */}
                    </OfficeCard>
                  </div>
                </div>
              </section>
            </main>
          </>
        </div>
      )}
    </div>
  );
}

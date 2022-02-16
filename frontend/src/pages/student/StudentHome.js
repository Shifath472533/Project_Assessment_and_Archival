import React from "react";
import OfficeCard from "../../components/office/OfficeCard";
import NavbarComponent from "../../components/common/NavbarComponent";
import { useHistory } from "react-router-dom";

export default function StudentHome(props) {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const handleClick = (type) => {
    if (type === "running") {
      history.push({
        pathname: "/student_curr_course",
        // search: "?query=abc",
        state: { type: type },
      });
    } else if (type === "completed") {
      history.push({
        pathname: "/student_prev_course",
        // search: "?query=abc",
        state: { type: type },
      });
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
                  icon="school"
                  title="Completed Courses"
                  onClick={() => handleClick("completed")}
                >
                  {/* Students */}
                </OfficeCard>
                <OfficeCard
                  color="lightBlue"
                  icon="stars"
                  title="Running Courses"
                  onClick={() => handleClick("running")}
                >
                  {/* Teachers */}
                </OfficeCard>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

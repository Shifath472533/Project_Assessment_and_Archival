import { useState, useEffect } from "react";
import SessionCard from "components/archive/SessionCard";
import NavbarComponent from "../../components/common/NavbarComponent";
import { useHistory } from "react-router-dom";

export default function OfficeStudentSession(props) {
  let history = useHistory();
  const token = localStorage.getItem("token");
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    let arr = [];
    for (let i = currentYear; i > 2016; i--) {
      arr.push(`${i - 1}-${i - 2000}`);
    }
    setSessions(arr);
  }, []);

  const handleClick = (session) => {
    // console.log(session);
    history.push({
      pathname: "/student_list",
      // search: "?query=abc",
      state: { session: session },
    });
  };

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <>
            <div className="container mx-auto px-2 w-full grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">
              {sessions.map((session) => {
                return (
                  <SessionCard
                    session={session}
                    onClick_={() => handleClick(session)}
                  />
                );
              })}
            </div>
          </>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import SessionCard from "components/archive/SessionCard";
import NavbarComponent from "../../components/common/NavbarComponent";
import { useHistory } from "react-router-dom";
import UploadProject from "../../components/archive/UploadProject";

export default function Session(props) {
  let history = useHistory();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const sessions = [];
    for (let i = currentYear; i >= 2016; i--) {
      sessions.push(`${i}`);
    }
    setSessions(sessions);
  }, []);

  const handleClick = (session) => {
    console.log(session);
    history.push({
      pathname: "/course",
      // search: "?query=abc",
      state: { session: session },
    });
  };

  return (
    <div>
      <NavbarComponent props={props} />
      {(localStorage.getItem("role") === "student" ||
							localStorage.getItem("role") === "teacher") && (
							<div className="flex flex-row justify-end my-5 xs:mx-auto mr-5">
								<UploadProject />
							</div>
						)}
      <div className="flex flex-row mx-20">
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
      </div>
    </div>
  );
}

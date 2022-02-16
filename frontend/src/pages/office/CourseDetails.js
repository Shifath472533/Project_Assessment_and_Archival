import H4 from "@material-tailwind/react/Heading4";
import LeadText from "@material-tailwind/react/LeadText";
import H6 from "@material-tailwind/react/Heading6";
import { useLocation } from "react-router-dom";
import { getSpecificCourse } from "../../Services/OfficeService";
import React, { useState, useEffect } from "react";
import NavbarComponent from "../../components/common/NavbarComponent";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CourseImage from "../../assets/images/courses.png";
import EditCourseModal from "../../components/profile/EditCourseModal";
import "../../components/loader/Loader2.css";
const useStyles = makeStyles((theme) => ({
  large: {
    fontSize: "25px",
    width: theme.spacing(23),
    height: theme.spacing(16),
  },
}));

export default function CourseDetails(props) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [details, setDetails] = useState([]);
  const classes = useStyles();
  const semesters = ["1/1", "1/2", "2/1", "2/2", "3/1", "3/2", "4/1", "4/2"];
  const [showLoading, setShowLoading] = useState(false);
  const [code, setCode] = useState(0);
  // const code = "NEED THE COURSE CODE";
  useEffect(() => {
    try {
      console.log(location.pathname);
      console.log(location.search);
      console.log(location.state.details);
      setDetails(location.state.details);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);
  useEffect(() => {
    if (code) {
      async function fetchData() {
        setShowLoading(true);
        const { success, msg, data } = await getSpecificCourse(code);
        console.log(success, msg, data);
        setShowLoading(false);
      }
      fetchData();
    }
  }, [code]);
  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <>
            {showLoading ? (
              <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                <span className="loader2"></span>
              </div>
            ) : (
              <main>
                <div className="pt-36 pb-32 d-flex align-items-start justify-content-start"></div>
                <section className="relative py-16 bg-gray-100">
                  <div className="container max-w-7xl px-4 mx-auto">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-2xl -mt-64">
                      <div className="px-6 sm:px-10 flex flex-col-reverse sm:flex-row justify-between items-center">
                        <div className="px-6 sm:px-10 md:px-20">
                          <div className="text-start my-8">
                            <H4 color="gray">{details.code}</H4>
                            <H6 className="mt-0 mb-2 text-gray-700 flex items-start justify-content-start gap-2">
                              {details.title}
                            </H6>
                            <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                              <span className="text-xl font-bold text-purple-900">
                                Credit
                              </span>{" "}
                              -{" "}
                              <span className="text-xl text-cyan-700">
                                {details.credit}
                              </span>
                            </div>
                            <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                              <span className="text-xl font-bold text-purple-900">
                                Semester
                              </span>{" "}
                              -{" "}
                              <span className="text-xl text-cyan-700">
                                {semesters[details.semester - 1]}
                              </span>
                            </div>
                          </div>
                          {details.description && (
                            <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                              <span className="text-xl font-bold text-purple-900">
                                Description
                              </span>
                            </div>
                          )}
                          {details.description && (
                            <div className="mb-10 text-start">
                              <div className="flex flex-wrap justify-content-start">
                                <div className="w-full lg:w-9/12 px-0 flex flex-col items-start">
                                  <LeadText color="blueGray">
                                    {details.description}
                                  </LeadText>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mr-14 pb-5">
                          <div className="text-start my-8 flex-wrap overflow-auto">
                            <div className="my-3 flex flex-row justify-end items-center">
                              <EditCourseModal details={details} />
                            </div>
                            <Avatar
                              className={classes.large}
                              /* variant="square" */
                              alt={details.title}
                              src={CourseImage}
                              style={{ height: "200px" }}>
                              {/* {profile.username} */}
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            )}
          </>
        </div>
      )}
    </div>
  );
}

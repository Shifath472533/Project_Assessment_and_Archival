import H4 from "@material-tailwind/react/Heading4";
import H6 from "@material-tailwind/react/Heading6";
import { useLocation } from "react-router-dom";
import { getStudentProfile } from "Services/ProfileService";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import React, { useState, useEffect } from "react";
import NavbarComponent from "../../components/common/NavbarComponent";
import UserImage from "../../assets/images/user.png";
import EditStudentModal from "../../components/profile/EditStudentModal";
import "../../components/loader/Loader2.css";
const useStyles = makeStyles((theme) => ({
  small: {
    fontSize: "25px",
    width: theme.spacing(23),
    height: theme.spacing(16),
  },
  large: {
    fontSize: "25px",
    width: theme.spacing(23),
    height: theme.spacing(16),
  },
}));

export default function StudentProfile(props) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState([]);
  const classes = useStyles();
  const [showLoading, setShowLoading] = useState(false);
  const [userId, setUserId] = useState(0);

  // const [userId, setUserId] = useState("");
  useEffect(() => {
    try {
      console.log(location.pathname);
      // console.log(location.search);
      console.log(location.state.profile);
      setProfile(location.state.profile);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);

  useEffect(() => {
    if (userId) {
      async function fetchData() {
        setShowLoading(true);
        const { success, msg, data } = await getStudentProfile(userId);
        console.log(success, msg, data);
        setShowLoading(false);
        setProfile(data);
      }
      fetchData();
    }
  }, [userId]);

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <div>
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
                      <div className="px-6 sm:px-10 flex flex-col-reverse sm:flex-row justify-between">
                        <div className="text-start my-8 flex-wrap overflow-auto">
                          <H4 color="gray">{profile.name}</H4>
                          <H6 className="mt-0 mb-2 text-gray-700 font-medium flex items-start justify-content-start gap-2">
                            Registration No.{" "}
                            <span className="text-2xl text-green-500">
                              {profile.username}
                            </span>
                          </H6>
                          <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                            <span className="text-xl font-bold text-purple-900">
                              Username
                            </span>{" "}
                            -{" "}
                            <span className="text-xl text-cyan-700">
                              {profile.username}
                            </span>
                          </div>
                          <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                            <span className="text-xl font-bold text-purple-900">
                              Date-of-Birth
                            </span>{" "}
                            -{" "}
                            <span className="text-xl text-cyan-700">
                              {profile &&
                                profile.dob &&
                                profile.dob.split("T")[0]}
                              {/* .split("T")[0] */}
                            </span>
                          </div>
                          <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                            <span className="text-xl font-bold text-purple-900">
                              Email
                            </span>{" "}
                            -{" "}
                            <span className="text-xl text-cyan-700">
                              {profile.email}
                            </span>
                          </div>
                          <div className="mb-2 text-gray-700 mt-5 flex items-start justify-content-start gap-2">
                            {/* <a
                            className="text-xl font-bold text-blue-900"
                            href="https://github.com/Shifath472533"
                            target="blank">
                            Github link
                          </a> */}
                            <span className="text-xl font-bold text-purple-900">
                              Github Username
                            </span>{" "}
                            -{" "}
                            <span className="text-xl text-cyan-700">
                              {profile.githubusername}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-start my-8 flex-wrap overflow-auto">
                            <div className="my-3 flex flex-row justify-end items-center">
                              <EditStudentModal profile={profile} />
                            </div>
                            <Avatar
                              className={classes.large}
                              /* variant="square" */
                              alt={profile.username}
                              src={UserImage}
                              style={{ height: "256px" }}>
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
          </div>
        </div>
      )}
    </div>
  );
}

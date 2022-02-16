import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
import H6 from "@material-tailwind/react/Heading6";
import GetProjectMembers from "../../utilityFuctions/GetProjectMembers";
import Card from "@material-tailwind/react/Card";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
import {
  allTaskOfCourse,
  studentSpecificCourse,
  studentTeamOfCourse,
} from "../../Services/StudentService";
import { specificCourse } from "../../Services/TeacherService";
import { allTaskOfTeam, specificTeam } from "../../Services/TeacherService";
import NavbarComponent from "../../components/common/NavbarComponent";
import EditProjectDetails from "../../components/student/EditProjectDetails";
import "../../components/loader/Loader2.css";
import FormatDate from "../../utilityFuctions/FormatDate";
import { allTeamOfCourse } from "../../Services/TeacherService";

export default function StudentAllTasks(props) {
  const history = useHistory();
  const location = useLocation();
  const [openTab, setOpenTab] = useState(1);
  const token = localStorage.getItem("token");
  const [registeredCourseId, setRegisteredCourseId] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState(0);
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [teamId, setTeamId] = useState(0);
  const [courseDescription, setCourseDescription] = useState(0);
  const [projectDescription, setProjectDescription] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  // const [tabLoading, setTabLoading] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [teams, setTeams] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [active, setActive] = useState("empty");
  const handleMin = (event) => {
    setMin(event.target.value);
  };
  const handleMax = (event) => {
    setMax(event.target.value);
  };
  const handleDateChange = (date) => {
    setDeadline(date);
  };

  const editorConfig = {};
  const [editorState, setEditorState] = React.useState(
    MUIEditorState.createEmpty(editorConfig)
  );
  const onChange = (newState) => {
    setEditorState(newState);
    setRawContent(convertToRaw(editorState.getCurrentContent()));
  };
  const [rawContent, setRawContent] = useState({
    blocks: [
      {
        data: { textAlign: "center" },
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "2vm6d",
        text: "No content",
        type: "unstyled",
      },
    ],
    entityMap: {},
  });

  const [courseRawContent, setCourseRawContent] = useState({
    blocks: [
      {
        data: { textAlign: "center" },
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "2vm6d",
        text: "No content",
        type: "unstyled",
      },
    ],
    entityMap: {},
  });

  const displayEditorConfig = {
    toolbar: { visible: false },
    draftEditor: { readOnly: true },
    editor: {
      wrapperElement: "div",
      style: {
        padding: 5,
        marginBottom: 10,
        // borderTop: "1px solid gray",
      },
    },
  };
  const [displayEditorState, setDisplayEditorState] = React.useState(
    MUIEditorState.createWithContent(
      displayEditorConfig,
      convertFromRaw({
        blocks: [
          {
            data: { textAlign: "center" },
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            key: "2vm6d",
            text: "No content",
            type: "unstyled",
          },
        ],
        entityMap: {},
      })
    )
  );
  const onDisplayEditorChange = (newState) => {
    setEditorState(newState);
  };

  const [projectRawContent, setProjectRawContent] = useState({
    blocks: [
      {
        data: { textAlign: "center" },
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "2vm6d",
        text: "No content",
        type: "unstyled",
      },
    ],
    entityMap: {},
  });

  const displayProjectEditorConfig = {
    toolbar: { visible: false },
    draftEditor: { readOnly: true },
    editor: {
      wrapperElement: "div",
      style: {
        padding: 5,
        marginBottom: 10,
        // borderTop: "1px solid gray",
      },
    },
  };
  const [displayProjectEditorState, setDisplayProjectEditorState] =
    React.useState(
      MUIEditorState.createWithContent(
        displayEditorConfig,
        convertFromRaw({
          blocks: [
            {
              data: { textAlign: "center" },
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
              key: "2vm6d",
              text: "No content",
              type: "unstyled",
            },
          ],
          entityMap: {},
        })
      )
    );
  const onDisplayProjectEditorChange = (newState) => {
    setEditorState(newState);
  };

  const courseDisplayEditorConfig = {
    toolbar: { visible: false },
    draftEditor: { readOnly: true },
    editor: {
      wrapperElement: "div",
      style: {
        padding: 5,
        marginBottom: 10,
        // borderTop: "1px solid gray",
      },
    },
  };
  const [courseDisplayEditorState, setCourseDisplayEditorState] =
    React.useState(
      MUIEditorState.createWithContent(
        displayEditorConfig,
        convertFromRaw({
          blocks: [
            {
              data: { textAlign: "center" },
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
              key: "2vm6d",
              text: "No content",
              type: "unstyled",
            },
          ],
          entityMap: {},
        })
      )
    );
  const onCourseDisplayEditorChange = (newState) => {
    setCourseDisplayEditorState(newState);
  };

  const handleClick = (task) => {
    history.push({
      pathname: "/student_individual_task",
      // search: "?query=abc",
      state: { task: task, active: active },
    });
  };

  useEffect(() => {
    try {
      console.log(location.pathname);
      console.log(location.search);
      console.log(location.state.course);
      setRegisteredCourseId(location.state.course._id);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);

  useEffect(() => {
    if (registeredCourseId) {
      async function fetchData() {
        const { success, msg, data } = await allTaskOfCourse(
          registeredCourseId
        );

        console.log(success, msg, data);
        if (success && data) {
          setTasks(data);
        }

        const {
          success: success1,
          msg: msg1,
          data: data1,
        } = await studentTeamOfCourse(registeredCourseId);
        console.log(success1, msg1, data1);
        if (success1 && data1) {
          setTeamInfo(data1.team);

          console.log("project description", data1.team.details);
          const desc = { ...data1.team.details };
          if (!("entityMap" in desc)) {
            desc["entityMap"] = {};
          }
          if (!("blocks" in desc)) {
            desc["blocks"] = [
              {
                data: { textAlign: "center" },
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: "2vm6d",
                text: "No content",
                type: "unstyled",
              },
            ];
          }
          console.log(desc);
          setDisplayProjectEditorState(
            MUIEditorState.createWithContent(
              displayProjectEditorConfig,
              convertFromRaw(desc)
            )
          );

          setStudentsInfo(data1.studentInfo);
          setUserInfo(data1.userInfo);
          setTeamMembers(GetProjectMembers(data1.userInfo, data1.studentInfo));
        }

        const {
          success: success2,
          msg: msg2,
          data: data2,
        } = await studentSpecificCourse(registeredCourseId);
        console.log(success2, msg2, data2);
        if (success2 && data2) {
          console.log("active data", data2.active);
          // setActive(false);
          setActive(data2.active);
          console.log("course description", data2.description);
          const desc = { ...data2.description };
          if (!("entityMap" in desc)) {
            desc["entityMap"] = {};
          }
          if (!("blocks" in desc)) {
            desc["blocks"] = [
              {
                data: { textAlign: "center" },
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: "2vm6d",
                text: "No content",
                type: "unstyled",
              },
            ];
          }
          console.log(desc);
          setCourseDisplayEditorState(
            MUIEditorState.createWithContent(
              courseDisplayEditorConfig,
              convertFromRaw(desc)
            )
          );
          setCourseDescription(desc);
          setMax(data2.member_no.max);
          setMin(data2.member_no.min);
          setDeadline(data2.formation_date);
          setShowLoading(false);
        }
      }
      fetchData();
    }
  }, [registeredCourseId]);

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <div className="mt-20 mx-3 md:mx-14 lg:mx-20">
            {showLoading ? (
              <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                <span className="loader2"></span>
              </div>
            ) : (
              <Tab>
                <div className="w-full flex md:flex-col flex-row content-center items-center justify-between flex-wrap px-1">
                  <TabList
                    className="flex flex-col items-stretch md:flex-row overflow-auto"
                    color="deepPurple">
                    <TabItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(1);
                      }}
                      ripple="light"
                      active={openTab === 1 ? true : false}
                      href="tabItem">
                      <H6 color="white">Tasks</H6>
                    </TabItem>
                    <TabItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(2);
                      }}
                      ripple="light"
                      active={openTab === 2 ? true : false}
                      href="tabItem">
                      <H6 color="white">Team Members</H6>
                    </TabItem>
                    <TabItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(3);
                      }}
                      ripple="light"
                      active={openTab === 3 ? true : false}
                      href="tabItem">
                      <H6 color="white">Project Details</H6>
                    </TabItem>
                    <TabItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(4);
                      }}
                      ripple="light"
                      active={openTab === 4 ? true : false}
                      href="tabItem">
                      <H6 color="white">Course Details</H6>
                    </TabItem>
                  </TabList>
                </div>

                <TabContent>
                  <TabPane
                    className="flex flex-col justify-evenly items-center"
                    active={openTab === 1 ? true : false}>
                    {tasks && !tasks.length && "No tasks created yet."}
                    {tasks &&
                      tasks.length > 0 &&
                      tasks.map((task) => {
                        return (
                          <div
                            className="w-11/12 flex flex-col sm:flex-row sm:flex-grow justify-between items-center shadow-lg rounded my-1 mx-5 bg-blue-500 py-3 text-left px-10 border-l-4 border-blue-800 hover:bg-blue-500 cursor-pointer hover:transition-transform ease-out duration-300 transform hover:scale-105"
                            onClick={() => handleClick(task)}>
                            <div className="text-2xl text-white ">
                              {task.title}
                            </div>
                            <div className="text-blue-900 text-md bg-cyan-100 border-blue-500 border-2 px-2">
                              {FormatDate(task.deadline)}
                            </div>
                          </div>
                        );
                      })}
                  </TabPane>
                  <TabPane active={openTab === 2 ? true : false}>
                    <div className="flex flex-col items-center lg:flex-row lg:justify-evenly">
                      {teamMembers &&
                        !teamMembers.length &&
                        "No team member found"}
                      {teamMembers &&
                        teamMembers.length > 0 &&
                        teamMembers.map((member) => {
                          return (
                            <div className="mx-3 w-full my-5 lg:my-0 lg:w-1/3 rounded-md bg-green-500 py-5 border-8 border-gray-300 shadow-md">
                              <div className="text-white text-2xl mb-3">
                                {/* S.M. Sadiq-Ur-Rahman Shifath{" "} */}
                                {member.name}
                              </div>
                              <div className="text-white text-xl">
                                {/* 2016331001 */}
                                {member.username}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </TabPane>
                  <TabPane active={openTab === 3 ? true : false}>
                    <div className="flex flex-col justify-center items-stretch">
                      <div className="flex flex-col justify-evenly mx-1 items-center lg:mx-10">
                        <div className="flex flex-col-reverse sm:flex-row w-full items-center sm:justify-between">
                          <div className="flex flex-col w-9/12 content-center justify-center my-3 border-t-4 border-gray-600 rounded-2xl mb-3 sm:mr-5">
                            <Card className="bg-blue-500">
                              <div className="text-white text-xl">
                                {teamInfo.projectTitle !== ""
                                  ? teamInfo.projectTitle
                                  : "Title not provided"}
                                {/* No Title */}
                              </div>
                            </Card>
                          </div>
                          <div className="my-3 w-9/12 sm:w-3/12 flex flex-row justify-center items-center">
                            <EditProjectDetails
                              title={teamInfo.projectTitle}
                              rawContent_={convertToRaw(
                                displayProjectEditorState.getCurrentContent()
                              )}
                              courseId={registeredCourseId}
                            />
                          </div>
                        </div>
                        <div className="my-3 w-full border-t-4 border-gray-200 rounded-2xl">
                          <Card>
                            <MUIEditor
                              editorState={displayProjectEditorState}
                              onChange={onDisplayProjectEditorChange}
                              config={displayProjectEditorConfig}
                            />
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane active={openTab === 4 ? true : false}>
                    <div className="flex flex-col justify-evenly mx-1 items center lg:mx-10">
                      <div className="my-3 border-t-4 border-gray-200 rounded-2xl">
                        <Card>
                          {courseDescription !== 0 && (
                            <MUIEditor
                              editorState={courseDisplayEditorState}
                              onChange={onCourseDisplayEditorChange}
                              config={courseDisplayEditorConfig}
                            />
                          )}
                        </Card>
                      </div>
                      <div className="flex flex-col items-center justify-center w-full md:w-11/12">
                        <div className="my-3 flex flex-col lg:flex-row lg:justify-evenly w-full sm:w-5/6 flex-grow">
                          <Card className="flex flex-col lg:flex-row justify-between items-center pl-5 pr-7 bg-gray-500 border-t-4 border-gray-600 rounded-2xl">
                            <div className="text-white text-2xl">
                              Number of team members
                            </div>
                            <div className="text-2xl flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-2 lg:mt-0">
                              <div className="bg-white text-xl mr-0 sm:mr-2 px-3 py-1 shadow-md rounded-md font-semibold">
                                Min :{" "}
                                <span className="text-teal-500 text-2xl">
                                  {max}
                                </span>
                              </div>
                              <div className="bg-white text-xl mt-2 sm:mt-0 ml-0 sm:ml-2 px-3 py-1 shadow-md rounded-md font-semibold">
                                Max :{" "}
                                <span className="text-red-500 text-2xl">
                                  {min}
                                </span>
                              </div>
                            </div>
                          </Card>

                          {/* <div className="my-1 flex flex-row items-center justify-center w-5/6 flex-grow">
                        <div className="mx-2 border-t-4 border-green-800 rounded-2xl flex-grow">
                          <Card className="bg-teal-500">
                            <div className="text-white text-xl">Min : 2</div>
                          </Card>
                        </div>
                        <div className="mx-2 border-t-4 border-indigo-900 rounded-2xl flex-grow">
                          <Card className="bg-indigo-500">
                            <div className="text-white text-xl">Max : 3</div>
                          </Card>
                        </div>
                      </div> */}
                        </div>
                        <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                          <Card className="bg-red-500">
                            <div className="text-white text-xl">
                              Deadline : {FormatDate(deadline)}
                            </div>
                          </Card>
                        </div>
                      </div>
                      {/* <div className="flex flex-col bg-blue-400 justify-evenly items-center md:mx-3 w-full rounded-md py-5 border-8 border-gray-100 shadow-md">
                    <div className="text-white text-xl mx-5 md:mx-20">
                      <MUIEditor
                        editorState={displayEditorState}
                        onChange={onDisplayEditorChange}
                        config={displayEditorConfig}
                      />
                    </div>
                    <div className="text-white text-2xl mx-2 mb-3 px-3 py-1 rounded-md shadow-md border-gray-300 border-4 bg-indigo-800 font-semibold">
                      Number of team members
                    </div>
                  </div> */}
                    </div>
                  </TabPane>
                </TabContent>
              </Tab>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

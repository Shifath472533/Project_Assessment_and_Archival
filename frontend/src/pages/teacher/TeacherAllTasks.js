import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
// import TextEditor from "../../components/DisplayTextEditor";
import Button from "@material-tailwind/react/Button";
import DateFnsUtils from "@date-io/date-fns";
import H6 from "@material-tailwind/react/Heading6";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  allTaskOfTeam,
  deleteTask,
  postTask,
  postTaskFile,
  specificTeam,
} from "../../Services/TeacherService";
import FileUploader from "../../components/FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "../../components/common/NavbarComponent";
import Input from "@material-tailwind/react/Input";
import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
import FormatDate from "../../utilityFuctions/FormatDate";
import "../../components/loader/Loader2.css";
// import "../../components/loader/Loader6.css";
import GetUsernameFromId from "../../utilityFuctions/GetUsernameFromId";
import GetNameFromId from "../../utilityFuctions/GetNameFromId";
import { findKey } from "lodash";
import DeleteTaskModal from "../../components/teacher/DeleteTaskModal";
import EditTask from "../../components/teacher/EditTask";
import Card from "@material-tailwind/react/Card";
import Icon from "@material-tailwind/react/Icon";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function TeacherAllTasks(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [openTab, setOpenTab] = useState(1);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamId, setTeamId] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState(0);
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [marks, setMarks] = useState("");
  //const [formData, setFormData] = useState("");
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToBeDeleted, setTaskToBeDeleted] = useState([]);
  const [projectDetails, setProjectDetails] = useState({});
  const [active, setActive] = useState("empty");
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
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "2vm6d",
        text: "No content",
        type: "header-six",
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
            data: {},
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            key: "2vm6d",
            text: "No content",
            type: "header-six",
          },
        ],
        entityMap: {},
      })
    )
  );
  const onDisplayEditorChange = (newState) => {
    setEditorState(newState);
  };

  useEffect(() => {
    try {
      console.log("2");
      console.log("showLoading", showLoading);
      // setShowLoading(true);
      console.log(location.pathname);
      console.log(location.search);
      console.log(location.state.team);
      console.log("active", location.state.active);
      // setActive("false");
      setActive(location.state.active);
      console.log(location.state.team.details);
      const desc = { ...location.state.team.details };
      if (!("entityMap" in desc)) {
        desc["entityMap"] = {};
      }
      if (!("blocks" in desc)) {
        desc["blocks"] = [
          {
            data: {},
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            key: "2vm6d",
            text: "No content",
            type: "header-six",
          },
        ];
      }
      console.log(desc);
      setProjectDetails(desc);
      setDisplayEditorState(
        MUIEditorState.createWithContent(
          displayEditorConfig,
          convertFromRaw(desc)
        )
      );
      //
      setTeamId(location.state.team._id);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);

  useEffect(() => {
    console.log("3");
    if (teamId) {
      async function fetchData() {
        const { success, msg, data } = await allTaskOfTeam(teamId);
        console.log(success, msg, data);
        if (success && data) {
          setTasks(data);
        }
        const {
          success: success_,
          msg: msg_,
          data: data_,
        } = await specificTeam(teamId);
        console.log(success_, msg_, data_);
        if (success_ && data_) {
          if (Object.keys(data_.team).length) {
            setStudentsInfo(data_.studentInfo);
            setUserInfo(data_.userInfo);
            setTeamInfo(data_.team);
          }
        }
      }
      fetchData();
    }
  }, [teamId]);

  useEffect(() => {
    if (Object.keys(teamInfo).length) {
      // console.log(teamInfo);
      // console.log(studentsInfo);
      // console.log(userInfo);
      // console.log(teamInfo.members_id);
      const members_ = [];
      for (let id of teamInfo.members_id) {
        let member_ = {};
        member_["id"] = id;
        member_["username"] = GetUsernameFromId(userInfo, id);
        member_["name"] = GetNameFromId(studentsInfo, id);
        // console.log(member_);
        members_.push(member_);
      }
      console.log(members_);
      setTeamMembers(members_);
      setShowLoading(false);
    }
  }, [studentsInfo, teamInfo, userInfo]);

  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  const [fileName, setFileName] = useState("No file Chosen yet.");
  const [fileType, setFileType] = useState("none");

  const onFileChange = (event) => {
    // console.log(event.target);
    const fileValue = event.target.files[0];
    if (fileValue.type !== "none") {
      // if (fileValue.type === "text/javascript" || fileValue.type === "text/csv") {
      setFileSelected(true);
      setSelectedFile(fileValue);
      setFileName(fileValue.name);
      setFileType(fileValue.type);
      /* let formData_ = new FormData();
      formData_.append("file", fileValue);
      setFormData(formData_);
      console.log(fileValue);
      console.log(formData_); */
    } else {
      toast.error("Invalid file format." + fileValue.type);
      return;
    }
  };

  // const onFileUpload = async () => {
  //   // if (!fileSelected) {
  //   //   toast.error("No file Selected.");
  //   //   return;
  //   // }
  //   // const formData = new FormData();
  //   // formData.append("file", selectedFile);
  //   // console.log(selectedFile);
  //   // file name remove
  //   // setFileName("No file Chosen yet.");
  // };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTaskEdit = (type) => {
    console.log(type);
  };

  const handleTaskName = (event) => {
    setTaskName(event.target.value);
  };

  const handleMarks = (event) => {
    setMarks(event.target.value);
  };

  const handleTaskDeleteModal = (task) => {
    setTaskToBeDeleted(task);
    setShowDeleteTaskModal(true);
    console.log(task);
  };

  const handleTaskDelete = async (task) => {
    console.log(task);
    setShowDeleteTaskModal(false);
    setTabLoading(true);
    const { success, msg, data } = await deleteTask(task._id);
    console.log(success, msg, data);
    if (success && data) {
    }
    setTabLoading(false);
    window.location.href = "/teacher_all_tasks";
  };

  const handleClick = (task) => {
    history.push({
      pathname: "/teacher_individual_task",
      // search: "?query=abc",
      state: { task: task, active: active },
    });
  };

  const handleSubmit = async (e) => {
    setDisplayEditorState(editorState);
    // setShowLoading(true);
    setTaskName("");
    setEditorState(MUIEditorState.createEmpty(editorConfig));
    setSelectedDate(new Date());
    setMarks("");

    if (fileSelected) {
      console.log("Inside", selectedFile);
      setFileName("No file Chosen yet.");
    }

    setTabLoading(true);
    console.log(editorState);
    const rawContent_ = convertToRaw(editorState.getCurrentContent());
    console.log(rawContent_);
    console.log(FormatDate(selectedDate));
    console.log("Team ID:  ", teamId);
    console.log(selectedFile);
    console.log(marks);

    const {
      success: success_,
      msg: msg_,
      data: data_,
    } = await postTask(
      teamId,
      taskName,
      rawContent_,
      marks,
      FormatDate(selectedDate)
    );
    console.log(success_, msg_, data_);
    if (success_ && data_) {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const taskId = data_._id;
        const { success, msg, data } = await postTaskFile(
          teamId,
          taskId,
          formData
        );
        console.log(success, msg, data);
      }
    }

    setTabLoading(false);
    window.location.href = "/teacher_all_tasks";
  };

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <div className="mt-20 mx-3 md:mx-14 lg:mx-20">
            <DeleteTaskModal
              taskToBeDeleted={taskToBeDeleted}
              handleTaskDelete={handleTaskDelete}
              showDeleteTaskModal={showDeleteTaskModal}
              setShowDeleteTaskModal={setShowDeleteTaskModal}
            />
            {showLoading === true && (
              <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                <span className="loader2"></span>
              </div>
            )}{" "}
            {showLoading === false && (
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
                    {active === true && (
                      <TabItem
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTab(4);
                        }}
                        ripple="light"
                        active={openTab === 4 ? true : false}
                        href="tabItem">
                        <H6 color="white">Create New Task</H6>
                      </TabItem>
                    )}
                  </TabList>
                </div>
                <TabContent>
                  <TabPane
                    className="flex flex-col justify-evenly items-center"
                    active={openTab === 1 ? true : false}>
                    <div className="w-full flex flex-col">
                      {tabLoading && (
                        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                          <span className="loader6"></span>
                        </div>
                      )}
                      {!tasks.length && "No tasks created yet."}
                      {tasks.map((task) => {
                        return (
                          <div className="flex flex-row justify-between content-center items-stretch">
                            <div
                              className="w-11/12 flex flex-col sm:flex-row sm:flex-grow justify-between items-center shadow-lg rounded my-1 ml-5 bg-teal-500 py-3 text-left px-10 border-l-4 border-gray-600 hover:bg-teal-500 cursor-pointer hover:transition-transform ease-out duration-300 transform hover:scale-105"
                              onClick={() => handleClick(task)}>
                              <div className="text-2xl text-white ">
                                {task.title}
                              </div>
                              <div className="text-teal-900 bg-cyan-100 border-teal-500 border-2 px-2">
                                {FormatDate(task.deadline)}
                              </div>
                            </div>
                            <div className="flex flex-col justify-evenly text-2xl font-semibold text-blue-900 text-left ml-3 sm:ml-10 mr-2 sm:mr-6">
                              {/* <DeleteIcon
                                className="text-red-500 transform cursor-pointer hover:transition-transform ease-out duration-100 hover:scale-125"
                                size="large"
                                // className={classes.margin}
                                onClick={() => handleTaskDeleteModal(task)}
                              /> */}
                              <Button
                                color="red"
                                buttonType="outline"
                                size="regular"
                                rounded={true}
                                block={false}
                                iconOnly={true}
                                ripple="light"
                                onClick={() => handleTaskDeleteModal(task)}>
                                <Icon name="delete" size="md" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                      {/* <div className="mb-5 sm:mr-5 flex flex-row justify-center items-center">
                        <div className="my-3 flex flex-col md:flex-row items-center md:justify-around w-full sm:w-11/12 flex-grow">
                          <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                            <Card className="bg-purple-500">
                              <div className="text-white text-xl">
                                Total Marks :{task.mark.total}
                              </div>
                            </Card>
                          </div>
                          <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                            <Card className="bg-red-500">
                              <div className="text-white text-xl">
                                Deadline :{task.deadline.split("T")[0]}
                              </div>
                            </Card>
                          </div>
                          <div className="my-3 flex flex-row justify-end items-center">
                            <EditTask task={"task"} />
                          </div>
                        </div>
                      </div> */}

                      <div className="flex flex-col justify-evenly mx-1 items-center lg:mx-10">
                        <div className="flex flex-col w-9/12 content-center justify-center my-3 border-t-4 border-gray-600 rounded-2xl">
                          <Card className="bg-blue-500">
                            <div className="text-white text-xl">
                              {/* {task.title} */}
                              {teamInfo.projectTitle}
                            </div>
                          </Card>
                        </div>
                        <div className="my-3 w-full border-t-4 border-gray-200 rounded-2xl">
                          <Card>
                            {/* {description !== 0 && ( */}
                            <MUIEditor
                              editorState={displayEditorState}
                              onChange={onDisplayEditorChange}
                              config={displayEditorConfig}
                            />
                            {/*  )} */}
                          </Card>
                        </div>
                        {/* <div className="flex flex-col items-center justify-center w-full md:w-11/12">
                            <div className="my-3 flex flex-col lg:flex-row lg:justify-between w-full sm:w-11/12 flex-grow">
                              <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                                <Card className="bg-purple-500">
                                  <div className="text-white text-xl">
                                    Total Marks :{task.mark.total}
                                  </div>
                                </Card>
                              </div>
                              <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                                <Card className="bg-red-500">
                                  <div className="text-white text-xl">
                                    Deadline :{task.deadline.split("T")[0]}
                                  </div>
                                </Card>
                              </div>
                              <div className="my-3 sm:mr-5 flex flex-row justify-end items-center">
                                <EditTask />
                              </div>
                            </div>
                          </div>
                         */}
                      </div>
                    </div>
                  </TabPane>
                  <TabPane active={openTab === 4 ? true : false}>
                    <div className="w-full flex flex-col">
                      {tabLoading && (
                        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                          <span className="loader6"></span>
                        </div>
                      )}
                      <div className="flex flex-col justify-evenly items-center">
                        <div className="mt-10 mb-10 flex flex-row justify-between items-center">
                          <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                            Task Name
                          </div>
                          <div className="mx-10">
                            <Input
                              type="text"
                              color="indigo"
                              size="lg"
                              outline={true}
                              placeholder="Task Name"
                              value={taskName}
                              onChange={(e) => handleTaskName(e)}
                            />
                          </div>
                        </div>
                        <div className="bg-gray-200 p-2 rounded-md shadow-md">
                          <MUIEditor
                            className="flex flex-row align-middle"
                            editorState={editorState}
                            onChange={onChange}
                            config={editorConfig}
                          />
                        </div>
                        <div className="mt-5 flex flex-col items-center lg:flex-row justify-center lg:justify-evenly">
                          <div>
                            <FileUploader onFileChange={onFileChange} />
                          </div>
                          <div>
                            <ToastContainer
                              toastClassName="relative flex p-1 min-h-10 rounded-md justify-center lg:justify-between overflow-hidden cursor-pointer"
                              bodyClassName="text-sm font-white font-med block p-3"
                              position="top-right"
                              autoClose="3000"
                            />
                          </div>
                          <div className="flex flex-row bg-blue-100 text-blue-900 rounded border-blue-600 border-2 mt-4 lg:mt-0 px-3 mx-2 lg:px-10 lg:ml-10">
                            {fileName}
                          </div>
                        </div>
                        {/* <div className="bg-gray-200 p-2 rounded-md shadow-md mt-5">
>>>>>>> a7c339893b6afbd0d692ed786b133408e3fc9f0b
                          <MUIEditor
                            editorState={displayEditorState}
                            onChange={onDisplayEditorChange}
                            config={displayEditorConfig}
                          />
                        </div> */}

                        <div className="mt-10 mb-5 flex flex-row justify-between items-center">
                          <div className="mx-10 border-l-4 text-center border-red-800 bg-red-100 text-red-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                            Deadline
                          </div>
                          <div className="mx-10">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                inputVariant="outlined"
                                label="Deadline"
                                format="yyyy/MM/dd"
                                value={selectedDate}
                                onChange={handleDateChange}
                                animateYearScrolling
                              />
                            </MuiPickersUtilsProvider>
                          </div>
                        </div>
                        <div className="mt-2 mb-5 flex flex-row justify-between items-center">
                          <div className="mx-10 border-l-4 text-center border-green-800 bg-green-100 text-green-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                            Marks
                          </div>
                          <div className="mx-10">
                            <Input
                              type="text"
                              color="indigo"
                              size="lg"
                              outline={true}
                              placeholder="Marks"
                              value={marks}
                              onChange={(e) => handleMarks(e)}
                            />
                          </div>
                        </div>
                        <div className="mt-5">
                          <Button onClick={handleSubmit} color="green">
                            Create
                          </Button>
                        </div>
                      </div>
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

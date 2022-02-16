import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
// import DisplayTextEditor from "../../components/DisplayTextEditor";
import "date-fns";
import Button from "@material-tailwind/react/Button";
import DateFnsUtils from "@date-io/date-fns";
import H6 from "@material-tailwind/react/Heading6";
import FileUploader from "../../components/FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteTeam,
  endCourse,
  initializeCourse,
  specificCourse,
  updateTeam,
  uploadTeamCSV,
} from "../../Services/TeacherService";
import { allTeamOfCourse } from "../../Services/TeacherService";
import NavbarComponent from "../../components/common/NavbarComponent";
import FormControl from "@material-ui/core/FormControl";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { convertToRaw, convertFromRaw } from "draft-js";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import Card from "@material-tailwind/react/Card";
import FormatDate from "../../utilityFuctions/FormatDate";
import "../../components/loader/Loader2.css";
import GetUsernameFromId from "../../utilityFuctions/GetUsernameFromId";
import EditTeamModal from "../../components/teacher/EditTeamModal";
import DeleteTeamModal from "../../components/teacher/DeleteTeamModal";
import "../../components/loader/Loader6.css";
import EndCourseModal from "../../components/teacher/EndCourseModal";
import Teams from "../../assets/images/team.png";

export default function TeacherTeams(props) {
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [openTab, setOpenTab] = useState(0);
  const [assignedCourseId, setAssignedCourseId] = useState(0);
  const [course, setCourse] = useState([]);
  const [teams, setTeams] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [min, setMin] = useState("select");
  const [max, setMax] = useState("select");
  const [deadline, setDeadline] = useState(new Date());
  const [description, setDescription] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [editableTeam, setEditableTeam] = useState([]);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [showEndCourseModal, setShowEndCourseModal] = useState(false);
  const [editedTeamTitle, setEditedTeamTitle] = useState("");
  const [teamToBeDeleted, setTeamToBeDeleted] = useState([]);
  const [teamsUpdated, setTeamsUpdated] = useState(false);
  const [active, setActive] = useState("empty");
  const handleTeamTitleChange = (event) => {
    // console.log(event.target.value);
    setEditedTeamTitle(event.target.value);
  };

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
  const [editorState, setEditorState] = useState(
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
  const [displayEditorState, setDisplayEditorState] = useState(
    MUIEditorState.createWithContent(
      displayEditorConfig,
      convertFromRaw(rawContent)
    )
  );
  const onDisplayEditorChange = (newState) => {
    setEditorState(newState);
  };

  useEffect(() => {
    try {
      console.log(location.pathname);
      console.log(location.search);
      console.log(location.state.course);
      setCourse(location.state.course);
      setAssignedCourseId(location.state.course._id);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);

  useEffect(() => {
    if (assignedCourseId) {
      async function fetchData() {
        const { success, msg, data } = await allTeamOfCourse(assignedCourseId);
        console.log(success, msg, data);
        if (success && data) {
          setTeams(data.team);
          // setUpdatingTeams(data.team.map((t) => false));
          setUsersInfo(data.allUserInfo);
        }
        const {
          success: success_,
          msg: msg_,
          data: data_,
        } = await specificCourse(assignedCourseId);
        console.log(success_, msg_, data_);
        if (success_ && data_) {
          console.log("active data", data_.active);
          // setActive(false);
          setActive(data_.active);
          setInitialized(data_.initialized);
          if (data_.initialized) {
            const date_ = data_.formation_date;
            setMax(data_.member_no.max);
            setMin(data_.member_no.min);
            setDeadline(date_.split("T")[0]);
            console.log(data_.description);
            const desc = { ...data_.description };
            if (!("entityMap" in desc)) {
              desc["entityMap"] = {};
            }
            setDescription(desc);
          } else {
            setShowLoading(false);
          }
        }
      }
      if (teamsUpdated === true) {
        fetchData();
        setTabLoading(false);
        setTeamsUpdated(false);
      } else {
        fetchData();
      }
    }
  }, [assignedCourseId, teamsUpdated]);

  useEffect(() => {
    if (initialized === true) {
      setOpenTab(1);
    } else if (initialized === false) {
      setOpenTab(4);
    }
  }, [initialized]);

  //   useEffect(() => {
  //     if (teamsUpdated === true) {
  //       setTabLoading(false);
  //       setTeamsUpdated(false);
  //       //   const { success, msg, data } = await allTeamOfCourse(assignedCourseId);
  //       //   console.log(success, msg, data);
  //     }
  //   }, [teamsUpdated]);

  useEffect(() => {
    if (description) {
      // console.log("description", description);
      // console.log("description", convertFromRaw(description));
      // console.log("displayEditorConfig", displayEditorConfig);
      setDisplayEditorState(
        MUIEditorState.createWithContent(
          displayEditorConfig,
          convertFromRaw(description)
        )
      );
      console.log(initialized);
      setShowLoading(false);
    }
  }, [description]);

  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  const [fileName, setFileName] = useState("No file Chosen yet.");
  const [fileType, setFileType] = useState("none");

  const onFileChange = (event) => {
    // console.log(event.target);
    const fileValue = event.target.files[0];
    if (
      fileValue.type === "application/vnd.ms-excel" ||
      fileValue.type === "text/csv"
    ) {
      setFileSelected(true);
      setSelectedFile(fileValue);
      setFileName(fileValue.name);
      setFileType(fileValue.type);
      console.log(fileValue);
    } else {
      toast.error("Invalid file format." + fileValue.type);
      return;
    }
  };

  const onFileUpload = async () => {
    if (!fileSelected) {
      toast.error("No file Selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData);

    // file name remove
    setFileName("No file Chosen yet.");

    // axios.post("api/uploadfile", formData);
    setTabLoading(true);
    console.log("assignedCourseId", assignedCourseId);
    // await uploadTeamCSV(formData, assignedCourseId);
    const { success, msg, data } = await uploadTeamCSV(
      formData,
      assignedCourseId
    );
    console.log("success msg: ", success, msg, data);
    setTabLoading(false);
    if (success && data) {
      toast.success(fileName + " File uploaded successfully");
    } else {
      toast.error(fileName + " File unable to upload");
    }

    // history.push({
    //   pathname: "/teacher_teams",
    //   // search: "?query=abc",
    //   state: { success: success, msg: msg },
    // });
    setTimeout(function () {
      window.location = "/teacher_teams";
    }, 1000);
  };

  const handleClick = (team) => {
    console.log(team);
    if (team) {
      history.push({
        pathname: "/teacher_all_tasks",
        // search: "?query=abc",
        state: { team: team, active: active },
      });
    }
    window.location = "/teacher_all_tasks";
  };

  const handleTeamEdit = (team, index) => {
    setEditableTeam(team);
    setEditedTeamTitle(team.title);
    setShowEditTeamModal(true);
  };

  const handleTeamSave = async (title) => {
    /* console.log("Changed Team title", title);
    console.log(teams.indexOf(editableTeam));
    console.log(editableTeam) */
    const teams_ = [...teams];
    for (let i = 0; i < teams_.length; i++) {
      if (teams_._id === editableTeam._id) {
        teams_.title = title;
      }
    }
    setTeams(teams_);
    setShowEditTeamModal(false);
    setTabLoading(true);
    const { success, msg, data } = await updateTeam(editableTeam._id, title);
    console.log(success, msg, data);
    console.log("Teams", teams, editableTeam);
    setTeamsUpdated(true);
  };

  const handleTeamDeleteModal = (team, index) => {
    setTeamToBeDeleted(team);
    setShowDeleteTeamModal(true);
    console.log(index, team);
  };

  const handleTeamDelete = async (team) => {
    setShowDeleteTeamModal(false);
    console.log(team);
    const { success, msg, data } = await deleteTeam(team._id);
    console.log(success, msg, data);
    window.location = "/teacher_teams";
  };

  const handleEndCourseModal = (e) => {
    // setTeamToBeDeleted(team);
    setShowEndCourseModal(true);
    console.log(e);
  };

  const handleEndCourse = async (course) => {
    console.log(course);
    const { success, msg, data } = await endCourse(course._id);
    console.log(success, msg, data);
    setShowEndCourseModal(false);
    window.location = "/teacher_home";
  };

  // EndCourseModal

  const handleSubmit = async (e) => {
    setDisplayEditorState(editorState);
    setEditorState(MUIEditorState.createEmpty(editorConfig));
    setMin("select");
    setMax("select");
    setDeadline(new Date());
    setTabLoading(true);

    console.log(editorState);
    const rawContent_ = convertToRaw(editorState.getCurrentContent());
    console.log(rawContent_);
    console.log(FormatDate(deadline), min, max, assignedCourseId);
    //DO THE JOB NEED TO BE DONE
    const { success, msg, data } = await initializeCourse(
      rawContent_,
      FormatDate(deadline),
      min,
      max,
      assignedCourseId
    );
    console.log(success, msg, data);
    setTabLoading(false);
    window.location = "/teacher_teams";
  };

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <div className="mt-20 mx-3 md:mx-14 lg:mx-20">
            <EditTeamModal
              editableTeam={editableTeam}
              setEditableTeam={setEditableTeam}
              editedTeamTitle={editedTeamTitle}
              setEditedTeamTitle={setEditedTeamTitle}
              handleTeamSave={handleTeamSave}
              showEditTeamModal={showEditTeamModal}
              setShowEditTeamModal={setShowEditTeamModal}
              handleTeamTitleChange={handleTeamTitleChange}
            />

            <DeleteTeamModal
              teamToBeDeleted={teamToBeDeleted}
              handleTeamDelete={handleTeamDelete}
              showDeleteTeamModal={showDeleteTeamModal}
              setShowDeleteTeamModal={setShowDeleteTeamModal}
            />

            <EndCourseModal
              course={course}
              handleEndCourse={handleEndCourse}
              showEndCourseModal={showEndCourseModal}
              setShowEndCourseModal={setShowEndCourseModal}
            />

            {/* {showLoading ? <div>loading</div> : <div>content</div>} */}
            {showLoading ? (
              <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                <span className="loader2"></span>
              </div>
            ) : (
              <Tab>
                <div className="w-full flex md:flex-col flex-row content-center items-center justify-between flex-wrap px-1">
                  <TabList
                    className="flex flex-col items-stretch md:flex-row overflow-auto justify-center md:justify-between"
                    color="deepPurple">
                    {!initialized ? (
                      <TabItem
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTab(4);
                        }}
                        ripple="light"
                        active={openTab === 4 ? true : false}
                        href="tabItem">
                        <H6 color="white">Start Course</H6>
                      </TabItem>
                    ) : (
                      <>
                        <div className="flex flex-col items-stretch md:flex-row overflow-auto">
                          <TabItem
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenTab(1);
                            }}
                            ripple="light"
                            active={openTab === 1 ? true : false}
                            href="tabItem">
                            <H6 color="white">Teams</H6>
                          </TabItem>
                          <TabItem
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenTab(2);
                            }}
                            ripple="light"
                            active={openTab === 2 ? true : false}
                            href="tabItem">
                            <H6 color="white">Upload Teams as CSV</H6>
                          </TabItem>
                          <TabItem
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenTab(3);
                            }}
                            ripple="light"
                            active={openTab === 3 ? true : false}
                            href="tabItem">
                            <H6 color="white">Course Details</H6>
                          </TabItem>
                        </div>
                        {active === true && (
                          <div>
                            <TabItem
                              className="bg-red-500 mt-5 md:mt-0 mx-1 md:mx-10 border-white border-2"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEndCourseModal(e);
                              }}
                              ripple="light"
                              // active={openTab === 5 ? true : false}
                              href="tabItem">
                              <H6 color="white">End Course</H6>
                            </TabItem>
                          </div>
                        )}
                      </>
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
                    </div>
                    {teams && !teams.length && "No Team created yet."}
                    {teams &&
                      teams.map((team) => {
                        const teamIndex = teams.indexOf(team);
                        return (
                          <div className="w-11/12 flex flex-row justify-between items-center">
                            <div
                              className="w-11/12 flex flex-col sm:flex-row justify-between items-center shadow-lg rounded-md my-2 bg-blue-500 py-5 text-left px-10 border-l-4 border-blue-900 hover:bg-blue-500 text-white cursor-pointer hover:transition-transform ease-out duration-300 transform hover:scale-105"
                              onClick={() => handleClick(team)}>
                              <div className="text-3xl text-center text-white mb-3">
                                {team.title}
                              </div>
                              <div className="flex flex-col lg:flex-row justify-evenly">
                                {team.members_id.map((teamId) => {
                                  return (
                                    <div className="mx-1 my-1 lg:my-0 border-2 border-white px-2 py-1 rounded-md shadow-md">
                                      {GetUsernameFromId(
                                        usersInfo[teamIndex],
                                        teamId
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex flex-col justify-evenly text-2xl font-semibold text-blue-900 text-left ml-2">
                              <EditIcon
                                className="mb-3 cursor-pointer hover:transition-transform ease-out duration-100 transform hover:scale-125"
                                onClick={() => handleTeamEdit(team, teamIndex)}
                              />
                              <DeleteIcon
                                className="text-red-500 cursor-pointer hover:transition-transform ease-out duration-100 transform hover:scale-125"
                                onClick={() =>
                                  handleTeamDeleteModal(team, teamIndex)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </TabPane>
                  <TabPane active={openTab === 2 ? true : false}>
                    <div className="w-full flex flex-col">
                      {tabLoading && (
                        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                          <span className="loader6"></span>
                        </div>
                      )}
                      <div className="flex flex-col items-center lg:flex-row justify-center lg:justify-evenly">
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
                        <div className="mt-5 flex flex-row justify-center lg:justify-center">
                          <Button onClick={onFileUpload}>Submit</Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Card>
                        <div className="px-6 py-4 flex flex-col">
                          <div className="rounded border border-2 bg-gray-200">
                            <h4 className="text-gray-800 text-3xl font-semibold">
                              Team CSV File Format
                            </h4>
                            <div className="text-red-500 font-semibold">
                              Ensure uploading file in the following csv format
                            </div>
                          </div>
                          {/* <p class="text-gray-700 text-base mt-5">
                        <H6>title,member1,member2,member3</H6>
                        Team1,2016331001,2016331103,2016331078
                      </p> */}
                          <img className="mt-5" src={Teams} alt="" />
                        </div>
                      </Card>
                    </div>
                  </TabPane>
                  <TabPane active={openTab === 3 ? true : false}>
                    <div className="flex flex-col justify-evenly mx-1 items center lg:mx-10">
                      <div className="my-3 border-t-4 border-gray-200 rounded-2xl">
                        <Card>
                          {description !== 0 && (
                            <MUIEditor
                              editorState={displayEditorState}
                              onChange={onDisplayEditorChange}
                              config={displayEditorConfig}
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
                  <TabPane active={openTab === 4 ? true : false}>
                    <div className="w-full flex flex-col">
                      {tabLoading && (
                        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                          <span className="loader6"></span>
                        </div>
                      )}
                      <div className="flex flex-col justify-evenly items-center">
                        <div className="bg-gray-200 p-2 rounded-md shadow-md">
                          <MUIEditor
                            className="flex flex-row align-middle"
                            editorState={editorState}
                            onChange={onChange}
                            config={editorConfig}
                          />
                        </div>

                        <div className="bg-gray-200 p-2 rounded-md shadow-md mt-5">
                          <MUIEditor
                            editorState={displayEditorState}
                            onChange={onDisplayEditorChange}
                            config={displayEditorConfig}
                          />
                        </div>

                        <div className="mt-10 mb-5 flex flex-row justify-between items-center">
                          <div className="mx-10 border-l-4 text-center border-red-800 bg-red-100 text-red-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                            Deadline
                          </div>
                          <div className="mx-10">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                className="px-auto"
                                margin="normal"
                                id="date-picker-dialog"
                                inputVariant="outlined"
                                label="Deadline"
                                format="yyyy/MM/dd"
                                value={deadline}
                                onChange={handleDateChange}
                                animateYearScrolling
                              />
                            </MuiPickersUtilsProvider>
                          </div>
                        </div>
                        <div className="mt-5 mb-10 flex flex-row justify-between items-center">
                          <div className="mx-10 border-l-4 text-center border-green-800 bg-green-100 text-green-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                            Number of team members
                          </div>
                          <div className="mx-10">
                            <FormControl className=" w-full" variant="outlined">
                              <InputLabel id="maximum">Maximum</InputLabel>
                              <Select
                                labelId="maximum"
                                id="maximum"
                                value={max}
                                onChange={handleMax}
                                label="maximum">
                                <MenuItem key={1} value={1}>
                                  1
                                </MenuItem>
                                <MenuItem key={2} value={2}>
                                  2
                                </MenuItem>
                                <MenuItem key={3} value={3}>
                                  3
                                </MenuItem>
                                <MenuItem key={4} value={4}>
                                  4
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                          <div className="mx-10">
                            <FormControl className=" w-full" variant="outlined">
                              <InputLabel id="minimum">Minimum</InputLabel>
                              <Select
                                labelId="minimum"
                                id="minimum"
                                value={min}
                                onChange={handleMin}
                                label="minimum">
                                <MenuItem key={1} value={1}>
                                  1
                                </MenuItem>
                                <MenuItem key={2} value={2}>
                                  2
                                </MenuItem>
                                <MenuItem key={3} value={3}>
                                  3
                                </MenuItem>
                                <MenuItem key={4} value={4}>
                                  4
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className="mt-5">
                          <Button color="green" onClick={handleSubmit}>
                            Start Course
                          </Button>
                        </div>
                        {/* <div className="bg-gray-200 p-2 rounded-md shadow-md mt-5">
                    <MUIEditor
                      editorState={displayEditorState}
                      onChange={onDisplayEditorChange}
                      config={displayEditorConfig}
                    />
                  </div> */}
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

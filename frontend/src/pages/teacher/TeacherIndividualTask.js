import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
import Textarea from "@material-tailwind/react/Textarea";
import Button from "@material-tailwind/react/Button";
// import TextEditor from "../../components/DisplayTextEditor";
import FileUploader from "../../components/FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import H6 from "@material-tailwind/react/Heading6";
import { addComment, specificTask } from "../../Services/TeacherService";
import NavbarComponent from "../../components/common/NavbarComponent";
import "../../components/loader/Loader2.css";
import "../../components/loader/Loader6.css";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
import EditIcon from "@material-ui/icons/Edit";
import EditTask from "../../components/teacher/EditTask";
import Card from "@material-tailwind/react/Card";

toast.configure();

export default function TeacherIndividualTask(props) {
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [openTab, setOpenTab] = useState(1);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  const [fileName, setFileName] = useState("No file Chosen yet.");
  const [fileType, setFileType] = useState("none");
  const [showLoading, setShowLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [task, setTask] = useState("no task");
  const [taskId, setTaskId] = useState("");
  const [description, setDescription] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [taskDir, setTaskDir] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submission, setSubmission] = useState(0);
  const [downloadPath, setDownloadPath] = useState("");
  const [downloadPathStudent, setDownloadPathStudent] = useState("");
  const downUrl = `http://localhost:5000/uploadFiles/`;
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

  // description provided by teacher
  const [rawContentTeacher, setRawContentTeacher] = useState({
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
      convertFromRaw(rawContentTeacher)
    )
  );
  const onDisplayEditorChange = (newState) => {
    // setDisplayEditorState(newState);
  };

  // description provided by student
  const [rawContentStudent, setRawContentStudent] = useState({
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
  const displayEditorConfigStudent = {
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
  const [displayEditorStateStudent, setDisplayEditorStateStudent] =
    React.useState(
      MUIEditorState.createWithContent(
        displayEditorConfigStudent,
        convertFromRaw(rawContentStudent)
      )
    );
  const onDisplayEditorChangeStudent = (newState) => {
    // setDisplayEditorState(newState);
  };

  const onFileChange = (event) => {
    // console.log(event.target);
    const fileValue = event.target.files[0];
    if (
      fileValue.type === "application/vnd.ms-excel" ||
      fileValue.type === "application/x-zip-compressed"
    ) {
      setFileSelected(true);
      setSelectedFile(fileValue);
      setFileName(fileValue.name);
      setFileType(fileValue.type);
    } else {
      toast.error("Invalid file format." + fileValue.type);
      return;
    }
  };

  useEffect(() => {
    try {
      async function fetchData() {
        console.log(location.state.task);
        console.log("active", location.state.active);
        // setActive("false");
        setActive(location.state.active);
        const taskId_ = location.state.task._id;
        setTaskId(taskId_);
        const { success, msg, data } = await specificTask(taskId_);
        console.log("Task Data", success, msg, data);
        if (success && data) {
          setTask(data.task);
          if ("description" in data.task.submission) {
            setSubmissions(data.task.submission.description);
            console.log(data.task.submission.description);
            console.log("submission", data.task.submission.description);
            const sub = {
              ...data.task.submission.description,
            };
            if (!("entityMap" in sub)) {
              sub["entityMap"] = {};
            }
            if (!("blocks" in sub)) {
              sub["blocks"] = [
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
            console.log(data.task.submission.directory);
            if (data.task.submission.directory) {
              setDownloadPathStudent(downUrl + data.task.submission.directory);
              console.log("hello", downUrl + data.task.submission.directory);
            }
            setSubmission(sub);
            setDisplayEditorStateStudent(
              MUIEditorState.createWithContent(
                displayEditorConfigStudent,
                convertFromRaw(sub)
              )
            );
          }
          setComments(data.comment);
          console.log("task", data.task);
          if (data.task.directory) {
            setDownloadPath(downUrl + data.task.directory);
            console.log(downUrl + data.task.directory);
          }
          console.log("description", data.task.description);
          const desc = { ...data.task.description };
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
          setDescription(desc);
          setDisplayEditorState(
            MUIEditorState.createWithContent(
              displayEditorConfig,
              convertFromRaw(desc)
            )
          );
        }
      }
      fetchData();
      if (showLoading) {
        setTabLoading(false);
      }
      // setShowLoading(false);
    } catch (e) {
      window.location = "/";
    }
  }, [location]);

  useEffect(() => {
    if (task !== "no task") {
      console.log(task);
      // setShowLoading(false);
    }
  }, [task]);

  useEffect(() => {
    if (
      Object.keys(description).length > 0 &&
      description.constructor === Object
    ) {
      setShowLoading(false);
      try {
        setDisplayEditorState(
          MUIEditorState.createWithContent(
            displayEditorConfig,
            convertFromRaw(description)
          )
        );
      } catch (e) {
        setDisplayEditorState(
          MUIEditorState.createWithContent(
            displayEditorConfig,
            convertFromRaw(rawContentTeacher)
          )
        );
      }
    }
  }, [description]);

  useEffect(() => {
    if (
      Object.keys(submission).length > 0 &&
      submission.constructor === Object
    ) {
      // setShowLoading(false);
      try {
        setDisplayEditorStateStudent(
          MUIEditorState.createWithContent(
            displayEditorConfigStudent,
            convertFromRaw(submission)
          )
        );
      } catch (e) {
        setDisplayEditorStateStudent(
          MUIEditorState.createWithContent(
            displayEditorConfigStudent,
            convertFromRaw(rawContentStudent)
          )
        );
      }
    }
  }, [submission]);

  const onFileUpload = () => {
    if (!fileSelected) {
      toast.error("No file Selected.");
      return;
    }
    const formData = new FormData();
    formData.append("selected file", selectedFile);
    console.log(selectedFile);

    setDisplayEditorState(editorState);
    setEditorState(MUIEditorState.createEmpty(editorConfig));
    setFileName("No file Chosen yet.");

    // axios.post("api/uploadfile", formData);

    setTabLoading(true);
    toast.info(fileName + " selected. It will be uploaded soon.");
    setTabLoading(false);
    // if (success) {
    //   toast.success(fileName + " File uploaded successfully");
    // } else {
    //   toast.error(fileName + " File unable to upload");
    // }
  };

  const commentChange = (e) => {
    setComment(e.target.value);
  };

  const submitComment = async () => {
    console.log(comment);
    setTabLoading(true);
    const { success, msg, data } = await addComment(task._id, comment);
    setComment("");
    console.log(success, msg, data);
    setTabLoading(false);
    if (success) {
      history.push({
        pathname: "/teacher_individual_task",
        // search: "?query=abc",
        state: { task: { _id: taskId }, active },
      });
    }
  };

  const downLoadFileStudent = (e) => {
    e.preventDefault();
    var downloadPath_ = "";
    if (submission.directory) downloadPath_ = downUrl + submission.directory;
    //console.log(downloadPath_);
    window.location.href = downloadPath_;
  };

  const downLoadFile = (e) => {
    e.preventDefault();
    if (downloadPath) window.location.href = downloadPath;
  };

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
                    color="deepPurple"
                  >
                    <TabItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(1);
                      }}
                      ripple="light"
                      active={openTab === 1 ? true : false}
                      href="tabItem"
                    >
                      <H6 color="white">Task</H6>
                    </TabItem>
                    <TabItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(2);
                      }}
                      ripple="light"
                      active={openTab === 2 ? true : false}
                      href="tabItem"
                    >
                      <H6 color="white">Comments</H6>
                    </TabItem>
                  </TabList>
                </div>
                <TabContent>
                  <TabPane active={openTab === 1 ? true : false}>
                    <div className="w-full flex flex-col">
                      {tabLoading && (
                        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                          <span className="loader6"></span>
                        </div>
                      )}
                      {task && (
                        <div className="flex flex-col justify-center items-stretch">
                          <div className="mb-5 sm:mr-5 flex flex-row justify-center items-center">
                            <div className="my-3 flex flex-col md:flex-row items-center md:justify-around w-full sm:w-11/12 flex-grow">
                              <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                                <Card className="bg-purple-500">
                                  <div className="text-white text-xl">
                                    Total Marks :
                                    {task &&
                                      task.hasOwnProperty("mark") &&
                                      task.mark.total}
                                  </div>
                                </Card>
                              </div>
                              <div className="my-3 border-t-4 border-gray-800 rounded-2xl">
                                <Card className="bg-red-500">
                                  <div className="text-white text-xl">
                                    Deadline :
                                    {task &&
                                      task.hasOwnProperty("deadline") &&
                                      task.deadline.split("T")[0]}
                                  </div>
                                </Card>
                              </div>
                              {active === true && (
                                <div className="my-3 flex flex-row justify-end items-center">
                                  <EditTask
                                    task={task}
                                    rawContent_={description}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col justify-evenly mx-1 items-center lg:mx-10">
                            <div className="flex flex-col w-9/12 content-center justify-center my-3 border-t-4 border-gray-600 rounded-2xl">
                              <Card className="bg-blue-500">
                                <div className="text-white text-xl">
                                  {task.title}
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
                          </div>
                          <div className="mt-5 mb-10 flex flex-row justify-center">
                            <Button
                              color="green"
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = downloadPath;
                              }}
                              ripple="light"
                            >
                              Download
                            </Button>
                          </div>
                          {Object.keys(submissions).length > 0 &&
                            submissions.constructor === Object && (
                              <div className="flex flex-col justify-evenly mx-1 items-center lg:mx-10">
                                <div className="my-3 w-full border-t-4 border-gray-200 rounded-2xl">
                                  <Card>
                                    <MUIEditor
                                      editorState={displayEditorStateStudent}
                                      onChange={onDisplayEditorChangeStudent}
                                      config={displayEditorConfigStudent}
                                    />
                                  </Card>
                                </div>
                                <div className="mt-5 mb-10 flex flex-row justify-center">
                                  <Button
                                    color="green"
                                    type="submit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href =
                                        downloadPathStudent;
                                    }}
                                    ripple="light"
                                  >
                                    Download
                                  </Button>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </TabPane>
                  <TabPane
                    className="flex flex-col justify-evenly items-center"
                    active={openTab === 2 ? true : false}
                  >
                    <div className="w-11/12 flex flex-col my-1 text-left items-center mb-2">
                      {tabLoading && (
                        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
                          <span className="loader6"></span>
                        </div>
                      )}
                      {comments &&
                        comments.length > 0 &&
                        comments.map((comment) => {
                          return (
                            <div className="text-lg my-1 w-full bg-blue-500 text-white border-l-4 py-3 rounded-lg text-left px-10 border-gray-800 pl-4 overflow-auto shadow-lg">
                              <div className="text-lg flex flex-row items-start text-white mr-4 p-2 border-white mb-3 md:mb-1">
                                <div className="border-2 border-white rounded-md px-3 shadow-lg">
                                  {comment.username}
                                </div>
                              </div>
                              {comment.comment}
                            </div>
                          );
                        })}
                    </div>
                    {/* <div className="w-11/12 flex flex-col md:flex-row my-1 text-left items-center mb-2">
                      <div className="text-lg bg-red-400 text-white border-l-4 py-3 rounded-lg text-left px-10 border-gray-800 pl-4 overflow-auto shadow-lg">
                        <div className="text-lg flex flex-row items-start text-white mr-4 p-2 border-white mb-3 md:mb-1">
                          <div className="border-2 border-white rounded-md px-3 shadow-lg">
                            MSI
                          </div>
                        </div>
                        Once upon a time
                      </div>
                    </div> */}
                    {active === true && (
                      <div className="w-11/12 mt-10 flex flex-col items-center shadow-md py-5">
                        <Textarea
                          color="lightBlue"
                          size="regular"
                          outline={true}
                          placeholder="Write your comment"
                          value={comment}
                          onChange={(e) => {
                            commentChange(e);
                          }}
                        />

                        <Button className="w-2/12" onClick={submitComment}>
                          Send
                        </Button>
                      </div>
                    )}
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

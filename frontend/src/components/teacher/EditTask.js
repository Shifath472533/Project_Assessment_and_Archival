import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
// import TextEditor from "../DisplayTextEditor";
import H5 from "@material-tailwind/react/Heading5";
import H6 from "@material-tailwind/react/Heading6";
// import DateFnsUtils from "@date-io/date-fns";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Input from "@material-tailwind/react/Input";
import FileUploader from "../FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
// import Card from "@material-tailwind/react/Card";
import "../../components/loader/Loader6.css";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormatDate from "../../utilityFuctions/FormatDate";
import { updateTask } from "Services/TeacherService";

toast.configure();

export default function EditTask(props) {
  const { task, rawContent_ } = props;
  const [showModal, setShowModal] = React.useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  // const [fileName, setFileName] = useState("No file Chosen yet.");
  // const [fileType, setFileType] = useState("none");
  const [deadline, setDeadline] = React.useState(new Date());
  const [mark, setMark] = React.useState(0);
  // const [showLoading, setShowLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

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
      convertFromRaw(rawContent)
    )
  );

  const onDisplayEditorChange = (rawContent) => {
    setDisplayEditorState(
      MUIEditorState.createWithContent(
        displayEditorConfig,
        convertFromRaw(rawContent)
      )
    );
  };

  const handleDateChange = (date) => {
    setDeadline(date);
  };

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handleMarkChange = (event) => {
    setMark(event.target.value);
  };

  const onFileChange = (event) => {
    // // console.log(event.target);
    // const fileValue = event.target.files[0];
    // if (
    //   // fileValue.type === "application/vnd.ms-excel" ||
    //   fileValue.type === "application/x-zip-compressed"
    // ) {
    //   setFileSelected(true);
    //   setSelectedFile(fileValue);
    //   setFileName(fileValue.name);
    //   setFileType(fileValue.type);
    // } else {
    //   toast.error("Invalid file format." + fileValue.type);
    // }
  };

  const onFileUpload = () => {
    // setDisplayEditorState(editorState);
    // settaskTitle("");
    // setEditorState(MUIEditorState.createEmpty(editorConfig));
    // setAge("Select");
    // if (fileSelected) {
    //   console.log("Inside", selectedFile);
    //   setFileName("No file Chosen yet.");
    // }
    // setShowModal(false);
    // setShowLoading(true);
    // if (!fileSelected) {
    //   toast.error("No file Selected.");
    //   return;
    // }
    // const formData = new FormData();
    // formData.append("selected file", selectedFile);
    // console.log(selectedFile);
    // // axios.post("api/uploadfile", formData);
    // setShowLoading(false);
    // console.log(formData);
    // toast.info(fileName + " selected. It will be uploaded soon.");
  };

  useEffect(() => {
    if (
      task &&
      task.hasOwnProperty("mark") &&
      task.hasOwnProperty("deadline")
    ) {
      setDeadline(task.deadline.split("T")[0]);
      setMark(task.mark.total);
      setTaskTitle(task.title);
      console.log(rawContent_);
      setEditorState(
        MUIEditorState.createWithContent(
          editorConfig,
          convertFromRaw(rawContent_)
        )
      );
      // setEditorState(displayEditorState_);
    }
  }, []);

  const handleUpdateTask = async () => {
    setShowModal(false);
    const rawContent_ = convertToRaw(editorState.getCurrentContent());
    console.log(rawContent_);
    console.log(FormatDate(deadline), mark, taskTitle);
    const { success, msg, data } = await updateTask(
      task._id,
      taskTitle,
      rawContent_,
      mark,
      FormatDate(deadline)
    );
    console.log(success, msg, data);
    window.location.href = "/teacher_individual_task";
  };

  return (
    <div>
      <Button
        className="pt-3 text-white flex flex-row justify-center items-center"
        color="green"
        onClick={(e) => setShowModal(true)}
      >
        <EditIcon className="mb-2" />
        <H6>
          <div className="text-white">Edit</div>
        </H6>
      </Button>
      <Modal
        className="mb-5 flex flex-row justify-center content-center"
        size="lg"
        active={showModal}
        toggler={() => setShowModal(false)}
      >
        <div className="my-2">
          <div className="flex flex-row justify-center">
            <ModalHeader
              className="text-center"
              toggler={() => setShowModal(false)}
            >
              <H5 color="blue">Edit task</H5>
            </ModalHeader>
          </div>
          <ModalBody>
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
                    value={taskTitle}
                    onChange={handleTaskTitleChange}
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

              {/* <div className="mt-5 flex flex-col items-center lg:flex-row justify-center lg:justify-evenly">
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
                </div> */}
              {/* <div className="bg-gray-200 p-2 rounded-md shadow-md mt-5">
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
                      value={deadline}
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
                    value={mark}
                    onChange={handleMarkChange}
                  />
                </div>
              </div>
            </div>

            {/* <ToastContainer
              toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
              bodyClassName="text-sm font-white font-med block p-3"
              position="top-right"
              autoClose="3000"
            /> */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="outline"
              onClick={(e) => setShowModal(false)}
              ripple="dark"
            >
              <Icon name="cancel" size="xl" />
              Cancel
            </Button>

            <Button color="blue" onClick={handleUpdateTask} ripple="light">
              <Icon name="update" size="xl" />
              Update
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}

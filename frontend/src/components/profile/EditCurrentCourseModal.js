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
import Textarea from "@material-tailwind/react/Textarea";

toast.configure();

export default function EditTask(props) {
  const { task } = props;
  const [showModal, setShowModal] = React.useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  // const [fileName, setFileName] = useState("No file Chosen yet.");
  // const [fileType, setFileType] = useState("none");
  // const [showLoading, setShowLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleCode = (event) => {
    setCode(event.target.value);
  };
  const [details, setDetails] = useState("");

  const handleDetails = (event) => {
    setDetails(event.target.value);
  };
  const [assignedTeacher, setAssignedTeacher] = useState("");

  const handleAssignedTeacher = (event) => {
    setAssignedTeacher(event.target.value);
  };

  const [credit, setCredit] = useState("select");

  const handleCredit = (event) => {
    setCredit(event.target.value);
  };

  useEffect(() => {
    // if (task.title.length > 0) {
    //   setDob(task.deadline.split("T")[0]);
    //   setMark(task.mark.total);
    //   setTaskTitle(task.title);
    // }
  }, []);

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

  const handleUpdateTask = () => {
    setShowModal(false);
    console.log(title, code, credit, details);
  };

  return (
    <div>
      <Button
        buttonType="outline"
        size="regular"
        rounded={true}
        block={false}
        iconOnly={true}
        ripple="light"
        color="green"
        onClick={(e) => setShowModal(true)}>
        <Icon name="edit" size="md" onClick={(e) => setShowModal(true)} />
      </Button>
      <Modal
        className="mb-5 flex flex-row justify-center content-center"
        size="lg"
        active={showModal}
        toggler={() => setShowModal(false)}>
        <div className="my-2">
          <div className="flex flex-row justify-center">
            <ModalHeader
              className="text-center"
              toggler={() => setShowModal(false)}>
              <H5 color="blue">Edit Course</H5>
            </ModalHeader>
          </div>
          <ModalBody>
            <div className="flex flex-col justify-evenly items-center">
              <div className="mt-10 mb-10 flex flex-row justify-between items-center">
                <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                  Course Title
                </div>
                <div className="mx-10">
                  <Input
                    type="text"
                    color="indigo"
                    size="lg"
                    outline={true}
                    placeholder="Course Title"
                    value={title}
                    onChange={handleTitle}
                  />
                </div>
              </div>
              <div className="mt-10 mb-10 flex flex-row justify-between items-center">
                <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                  Course Code
                </div>
                <div className="mx-10">
                  <Input
                    type="text"
                    color="teal"
                    size="lg"
                    outline={true}
                    placeholder="Course Code"
                    name="code"
                    value={code}
                    onChange={(e) => handleCode(e)}
                  />
                </div>
              </div>

              <div className="mt-10 mb-5 flex flex-row justify-between items-center">
                <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                  Assigned Teacher
                </div>
                <div className="mx-10">
                  <Input
                    type="text"
                    color="teal"
                    size="lg"
                    outline={true}
                    placeholder="Assigned Teacher"
                    name="assignedTeacher"
                    value={assignedTeacher}
                    onChange={(e) => handleAssignedTeacher(e)}
                  />
                </div>
              </div>
              <div className="mt-10 mb-5 flex flex-row justify-between items-center">
                <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                  Course Details
                </div>
                <div className="mx-10">
                  <Textarea
                    color="lightBlue"
                    size="regular"
                    outline={true}
                    placeholder="Course Details"
                    name="details"
                    value={details}
                    onChange={(e) => handleDetails(e)}
                  />
                </div>
              </div>
              <div className="mt-2 mb-5 flex flex-row justify-between items-center">
                <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                  Credit
                </div>
                <div className="mx-10">
                  <InputLabel id="Credit">Credit</InputLabel>
                  <Select
                    labelId="Credit"
                    id="Credit"
                    name="credit"
                    value={credit}
                    onChange={handleCredit}
                    label="Credit">
                    <MenuItem value={"1"}>1</MenuItem>
                    <MenuItem value={"1.5"}>1.5</MenuItem>
                    <MenuItem value={"2"}>2</MenuItem>
                    <MenuItem value={"2.5"}>2.5</MenuItem>
                    <MenuItem value={"3"}>3</MenuItem>
                    <MenuItem value={"3.5"}>3.5</MenuItem>
                    <MenuItem value={"4"}>4</MenuItem>
                  </Select>
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
              ripple="dark">
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

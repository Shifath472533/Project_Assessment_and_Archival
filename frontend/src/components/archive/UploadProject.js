import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
// import TextEditor from "../DisplayTextEditor";
import H5 from "@material-tailwind/react/Heading5";
// import DateFnsUtils from "@date-io/date-fns";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Input from "@material-tailwind/react/Input";
import FileUploader from "../../components/FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
// import Card from "@material-tailwind/react/Card";
import "../../components/loader/Loader2.css";
import { getSemesterBasedCourse } from "../../Services/OfficeService";
import { getAllTeams } from "../../Services/ArchiveService";
import { getYearBasedCourse } from "../../Services/ArchiveService";
import { submitProject } from "../../Services/ArchiveService";
import { submitProjectFile } from "../../Services/ArchiveService";

toast.configure();

export default function UploadProject() {
  const history = useHistory();
  const [showModal, setShowModal] = React.useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  const [fileName, setFileName] = useState("No file Chosen yet.");
  const [fileSize, setFileSize] = useState("0 MB");
  const [fileType, setFileType] = useState("none");
  const [year, setYear] = useState("select");
  const [years, setYears] = useState([]);
  const [course, setCourse] = useState("select");
  const [courses, setCourses] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [courseId, setCourseId] = useState("select");
  const [courseCodeDisabled, setCourseCodeDisabled] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [tag, setTag] = useState("");
  const [teamIdDisabled, setTeamIdDisabled] = useState(true);
  const [teamId, setTeamId] = useState("select");
  const [teams, setTeams] = useState([]);

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
    setSelectedDate(date);
  };
  const handleYearChange = (event) => {
    console.log(event.target.value);
    setYear(event.target.value);
  };

  const handleCourse = (event) => {
    setCourse(event.target.value);
  };

  const handlecourseIdChange = (event) => {
    console.log("id " + event.target.value);
    setCourseId(event.target.value);
  };

  const handleTeamId = (event) => {
    console.log(event.target.value);
    setTeamId(event.target.value);
  };

  const handleProjectTitle = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleTag = (event) => {
    setTag(event.target.value);
  };

  useEffect(() => {
    if (courses.length > 0) {
      setCourseCodeDisabled(false);
    } else {
      setCourseCodeDisabled(true);
    }
  }, [courses]);

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    let yrs = [];
    for (let i = currentYear; i > 2016; i--) {
      yrs.push(`${i}`);
    }
    setYears(yrs);
  }, []);

  useEffect(() => {
    if (teams.length > 0) {
      setTeamIdDisabled(false);
    } else {
      setTeamIdDisabled(true);
    }
  }, [teams]);

  useEffect(() => {
    if (year !== "select") {
      async function fetchData() {
        // edit getYearBasedCourses
        const { success, msg, data } = await getYearBasedCourse(year);
        console.log(success, msg, data);
        setCourses(data);
        /* setCourses([
					{ _id: "1", code: "CSE150" },
					{ _id: "2", code: "CSE250" },
					{ _id: "3", code: "CSE350" },
				]); */
      }
      fetchData();
    }
  }, [year]);

  useEffect(() => {
    if (courseId !== "select") {
      async function fetchData() {
        // edit getcourseIdBasedTeams
        const { success, msg, data } = await getAllTeams(courseId, year);
        console.log(success, msg, data);
        setTeams(data);
        // setTeams([
        //   { _id: "1", name: "Team 01" },
        //   { _id: "2", name: "Team 02" },
        //   { _id: "3", name: "Team 03" },
        // ]);
      }
      fetchData();
    }
  }, [courseId]);

  // useEffect(() => {
  //   if (year) {
  //     async function fetchData() {
  //       // edit getYearbasedcourse
  //       const { success, msg, data } = await getSemesterBasedCourse(year);
  //       console.log(success, msg, data);
  //       setCourses(data);
  //     }
  //     fetchData();
  //   }
  // }, [year]);

	const onFileChange = (event) => {
		// console.log(event.target);
		const fileValue = event.target.files[0];
		console.log(fileValue.type);
		if (
			/* fileValue.type === "application/zip" ||
			fileValue.type === "application/x-zip-compressed" || */
			fileValue.type !== ""
		) {
			setFileSelected(true);
			setSelectedFile(fileValue);
			setFileName(fileValue.name);
			setFileType(fileValue.type);
			setFileSize(`${Math.round(fileValue.size / 1024 / 1024)} MB`);
		} else {
			toast.error("Invalid file format." + fileValue.type);
		}
	};

  const onProjectUpload = async () => {
    setDisplayEditorState(editorState);
    setProjectTitle("");
    setEditorState(MUIEditorState.createEmpty(editorConfig));
    setYear("Select");
    if (fileSelected) {
      console.log("Inside", selectedFile);
      setFileName("No file Chosen yet.");
    }
    setShowModal(false);
    // setShowLoading(true);
    if (!fileSelected) {
      toast.error("No file Selected.");
      return;
    }

    const { success, msg, data } = await submitProject(
      projectTitle,
      rawContent,
      year,
      courseId,
      teamId,
      tag
    );
    console.log(success, msg, data);
    // setShowLoading(false);


    if (selectedFile && success) {
      const projectId = data._id;
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("size", fileSize);
      const {
        success: success_,
        msg: msg_,
        data: data_,
      } = await submitProjectFile(projectId, formData);
      console.log(success_, msg_, data_);
      window.location = "/project";
    }

    console.log(fileSize);
    console.log(year);
    console.log(courseId);
    console.log(teamId);
    console.log(tag);
    console.log(rawContent);
    // axios.post("api/uploadfile", formData);
    // setShowLoading(false);
    toast.success("Project Uploaded");
    // toast.info(fileName + " selected. It will be uploaded soon.");
  };

  return (
    <div>
      <div className="md-5">
        {showLoading && (
          <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
            <span className="loader2"></span>
          </div>
        )}
        <div className="w-full flex flex-col">
          <Button
            color="teal"
            type="button"
            onClick={(e) => setShowModal(true)}
            ripple="light">
            <Icon name="upload" size="xl" />
            Upload Project
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
                  <H5 color="teal">
                    Provide the details and upload your project
                  </H5>
                </ModalHeader>
              </div>
              <ModalBody>
                <div className="flex flex-col justify-evenly items-center">
                  <div className="mt-10 mb-10 flex flex-row justify-between items-center">
                    <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                      Project Title
                    </div>
                    <div className="mx-10">
                      <Input
                        type="text"
                        color="indigo"
                        size="lg"
                        outline={true}
                        placeholder="Project Title"
                        value={projectTitle}
                        onChange={(e) => handleProjectTitle(e)}
                      />
                    </div>
                  </div>

                  <div className="mt-10 mb-10 flex flex-row justify-between items-center">
                    <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                      Tag
                    </div>
                    <div className="mx-10">
                      <Input
                        type="text"
                        color="indigo"
                        size="lg"
                        outline={true}
                        placeholder="Tag"
                        value={tag}
                        onChange={(e) => handleTag(e)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="w-7/12 mx-10 border-l-8 text-center border-purple-800 bg-purple-300 text-purple-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1 mb-4">
                      Project Description
                    </div>
                    <div className="bg-gray-200 p-2 rounded-md shadow-md">
                      <MUIEditor
                        className="flex flex-row align-middle"
                        editorState={editorState}
                        onChange={onChange}
                        config={editorConfig}
                      />
                    </div>

                    {/* <div className="bg-gray-200 p-2 rounded-md shadow-md mt-5">
                      <MUIEditor
                        editorState={displayEditorState}
                        onChange={onDisplayEditorChange}
                        config={displayEditorConfig}
                      />
                    </div> */}
                  </div>
                  <div className="mt-10 w-8/12 mb-5 flex flex-row justify-between items-center">
                    <div className="mx-10 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
                      Year
                    </div>
                    <div className="flex flex-row flex-grow justify-around">
                      <div>
                        <FormControl
                          ClassName=" w-full mt-5"
                          variant="outlined">
                          <InputLabel id="year">Year</InputLabel>
                          <Select
                            labelId="year"
                            id="year"
                            value={year}
                            onChange={handleYearChange}
                            label="year">
                            <MenuItem value={2016}>2016</MenuItem>
                            <MenuItem value={2017}>2017</MenuItem>
                            <MenuItem value={2018}>2018</MenuItem>
                            <MenuItem value={2020}>2020</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          ClassName=" w-full mt-5"
                          variant="outlined"
                          disabled={courseCodeDisabled}>
                          <InputLabel id="courseId">courseId</InputLabel>
                          <Select
                            labelId="courseId"
                            id="courseId"
                            value={courseId}
                            onChange={handlecourseIdChange}
                            label="courseId">
                            {courses.map((course_) => {
                              return (
                                <MenuItem key={course_._id} value={course_._id}>
                                  {course_.code}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          ClassName=" w-full mt-5"
                          variant="outlined"
                          disabled={teamIdDisabled}>
                          <InputLabel id="Team ID">Team</InputLabel>
                          <Select
                            labelId="Team ID"
                            id="Team ID"
                            value={teamId}
                            onChange={handleTeamId}
                            label="Team ID">
                            {teams.map((team_) => {
                              return (
                                <MenuItem key={team_._id} value={team_._id}>
                                  {team_.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center lg:flex-row justify-center lg:justify-evenly">
                    <div className="mt-5 flex flex-col items-center lg:flex-row justify-center lg:justify-evenly">
                      <div>
                        <FileUploader
                          color="teal"
                          onFileChange={onFileChange}
                        />
                      </div>
                      <div>
                        <ToastContainer
                          toastClassName="relative flex p-1 min-h-10 rounded-md justify-center lg:justify-between overflow-hidden cursor-pointer"
                          bodyClassName="text-sm font-white font-med block p-3"
                          position="top-right"
                          autoClose="3000"
                        />
                      </div>
                      <div className="flex flex-row bg-teal-100 text-teal-900 rounded border-teal-500 border-2 mt-4 lg:mt-0 px-3 mx-2 lg:px-10 lg:ml-10">
                        {fileName}
                      </div>
                    </div>
                  </div>
                </div>
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

                <Button
                  color="green"
                  onClick={(e) => onProjectUpload("hello")}
                  ripple="light">
                  <Icon name="upload" size="xl" />
                  Upload
                </Button>
              </ModalFooter>
            </div>
          </Modal>
        </div>
        <div className="my-3"></div>
      </div>
      <ToastContainer
        toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        bodyClassName="text-sm font-white font-med block p-3"
        position="top-right"
        autoClose="3000"
      />
    </div>
  );
}

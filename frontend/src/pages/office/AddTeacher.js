import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
import AddTeacherForm from "../../components/office/AddTeacherForm";
import Button from "@material-tailwind/react/Button";
import H6 from "@material-tailwind/react/Heading6";
import FileUploader from "../../components/FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "../../components/common/NavbarComponent";
import { addTeacherCSV } from "Services/OfficeService";
import Card from "@material-tailwind/react/Card";
import Teacher from "../../assets/images/teacher.png";
import "../../components/loader/Loader6.css";

toast.configure();

export default function AddTeacher(props) {
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [openTab, setOpenTab] = useState(1);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState("none");
  const [fileName, setFileName] = useState("No file Chosen yet.");
  const [fileType, setFileType] = useState("none");
  const [showLoading, setShowLoading] = useState(false);

  const onFileChange = (event) => {
    // console.log(event.target);
    const fileValue = event.target.files[0];
    console.log(fileValue.type);
    if (
      fileValue.type === "application/vnd.ms-excel" ||
      fileValue.type === "text/csv"
    ) {
      setFileSelected(true);
      setSelectedFile(fileValue);
      setFileName(fileValue.name);
      setFileType(fileValue.type);
    } else {
      toast.error("Invalid file format. " + fileValue.type);
      return;
    }
  };

  useEffect(() => {
    try {
      console.log(location.pathname);
      setSelectedDate(new Date());
      setFileSelected(false);
      setSelectedFile("none");
      setFileName("No file Chosen yet.");
      setFileType("none");
      if (location.state) {
        console.log(location.state.success);
        //   if (location.state.success) {
        //     toast.success("Teacher Information added successfully");
        //   } else {
        //     toast.error("Unable to submit the provided Teacher Information");
        //   }
      }
    } catch (e) {
      window.location = "/error_page";
    }
  }, [location]);

  const onFileUpload = async () => {
    if (!fileSelected) {
      toast.error("No file Selected.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(selectedFile);
    setFileName("No file Chosen yet.");

    setShowLoading(true);
    toast.info(fileName + " selected. It will be uploaded soon.");
    const { success, msg, data } = await addTeacherCSV(formData);
    console.log(success, msg, data);
    setShowLoading(false);
    // history.push({
    //   pathname: "/add_teacher",
    //   // search: "?query=abc",
    //   state: { success: success, msg: msg },
    // });
    if (success) {
      toast.success(fileName + " File uploaded successfully");
    } else {
      toast.error(fileName + " File unable to upload");
    }
  };

  return (
    <div>
      {token && (
        <div>
          <NavbarComponent props={props} />
          <div className="mt-20 mx-3 md:mx-14 lg:mx-20">
            <Tab>
              <div className="w-full flex md:flex-col flex-row content-center items-center justify-between flex-wrap px-1">
                <TabList
                  className="flex flex-col items-stretch md:flex-row overflow-auto"
                  color="teal">
                  <TabItem
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(1);
                    }}
                    ripple="light"
                    active={openTab === 1 ? true : false}
                    href="tabItem">
                    <H6 color="white">Add Teacher Form</H6>
                  </TabItem>
                  <TabItem
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                    ripple="light"
                    active={openTab === 2 ? true : false}
                    href="tabItem">
                    <H6 color="white">Add Teacher using CSV</H6>
                  </TabItem>
                </TabList>
              </div>

              <TabContent>
                <TabPane
                  className="flex flex-col justify-evenly items-center"
                  active={openTab === 1 ? true : false}>
                  <AddTeacherForm />
                </TabPane>
                <TabPane active={openTab === 2 ? true : false}>
                  <div className="w-full flex flex-col">
                    {showLoading && (
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
                      <div class="px-6 py-4 flex flex-col">
                        <div className="rounded border border-2 bg-gray-200">
                          <h4 class="text-gray-800 text-3xl font-semibold">
                            Teacher CSV File Format
                          </h4>
                          <div className="text-red-500 font-semibold">
                            Ensure uploading file in the following csv format
                          </div>
                        </div>
                        {/* <p class="text-gray-700 text-base">
                          <H6>username,name,email,designation,dob</H6>
                          msi,Saiful,msi@sust.com,Assistant Prof,1990-10-01
                        </p> */}
                        <img className="mt-5" src={Teacher} alt="" />
                      </div>
                    </Card>
                  </div>
                </TabPane>
              </TabContent>
            </Tab>
            <ToastContainer
              toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
              bodyClassName="text-sm font-white font-med block p-3"
              position="top-right"
              autoClose="3000"
            />
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { useLocation, useHistory } from "react-router-dom";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
import AddCourseForm from "../../components/office/AddCourseForm";
import RemoveCourseForm from "../../components/office/RemoveCourseForm";
import H6 from "@material-tailwind/react/Heading6";
import { toast } from "react-toastify";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "../../components/common/NavbarComponent";

toast.configure();

export default function AddCourse(props) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [openTab, setOpenTab] = useState(1);

  useEffect(() => {
    try {
      console.log(location.pathname);
      if (location.state) {
        console.log(location.state.success);
        //   if (location.state.success) {
        //     toast.success("Course Information added successfully");
        //   } else {
        //     toast.error("Unable to submit the provided Course Information");
        //   }
      }
    } catch (e) {
      window.location = "/error_page";
    }
  }, [location]);

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
                    <H6 color="white">Add Course</H6>
                  </TabItem>
                  <TabItem
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                    ripple="light"
                    active={openTab === 2 ? true : false}
                    href="tabItem">
                    <H6 color="white">Remove Course</H6>
                  </TabItem>
                </TabList>
              </div>

              <TabContent>
                <TabPane
                  className="flex flex-col justify-evenly items-center"
                  active={openTab === 1 ? true : false}>
                  <AddCourseForm />
                </TabPane>
                <TabPane active={openTab === 2 ? true : false}>
                  <RemoveCourseForm />
                </TabPane>
              </TabContent>
            </Tab>
          </div>
        </div>
      )}
    </div>
  );
}

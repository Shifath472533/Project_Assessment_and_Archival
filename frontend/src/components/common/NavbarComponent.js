import { useState } from "react";
// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
// import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
// import Nav from "@material-tailwind/react/Nav";
// import NavLink from "@material-tailwind/react/NavLink";
// import Dropdown from "@material-tailwind/react/Dropdown";
// import DropdownItem from "@material-tailwind/react/DropdownItem";
import Icon from "@material-tailwind/react/Icon";
// import Button from "@material-tailwind/react/Button";
import DvrIcon from "@material-ui/icons/Dvr";
import ArchiveIcon from "@material-ui/icons/Archive";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

export default function NavbarComponent(props) {
  const [openNavbar, setOpenNavbar] = useState(false);
  const token = localStorage.getItem("token");
  // const id = localStorage.getItem("_id");
  const role = localStorage.getItem("role");
  const handleLogout = () => {
    // props.history.pushState(null, null, "/");
    window.history.replaceState(null, null, "/");
    window.location = "/";
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };
  return (
    <div>
      {token && (
        <Navbar
          className="m-3 py-3 rounded-md border-l-4 border-r-4 border-gray-800 bg-blue-900 text-while shadow-lg"
          navbar
          color="none"
        >
          <NavbarContainer>
            <NavbarWrapper>
              <div className="text-white border-l-white border-l-4 border-r-4 bg-indigo-900 text-center mr-3 px-1 md:px-3 py-1 hover:transform hover:scale-105 duration-300 ease-out">
                <DvrIcon className="ml-1 mr-3" />
                Project Assessment & Archive System
              </div>
              <NavbarToggler
                onClick={() => setOpenNavbar(!openNavbar)}
                color="white"
              />
            </NavbarWrapper>
            <NavbarCollapse
              className="flex flex-col mt-2 lg:mt-0 sm:flex-row justify-end items-center text-white text-xl"
              open={openNavbar}
            >
              {/* <div className="flex flex-row justify-between items-center text-white text-xl"> */}
              {role === "student" && (
                <Link
                  className="mr-5 mt-4 sm:mt-0 flex flex-row items-center justify-between ml-5 hover:border-b-2 border-white transition-all hover:ease-in duration-200 hover:border-t-2"
                  to="/student_home"
                >
                  <AccountBalanceIcon />
                  {/* <Icon name="home" size="xl" /> */}
                  <div className="ml-2">Home</div>
                </Link>
              )}
              {role === "teacher" && (
                <Link
                  className="mr-5 mt-4 sm:mt-0 flex flex-row items-center justify-between ml-5 hover:border-b-2 border-white transition-all hover:ease-in duration-200 hover:border-t-2"
                  to="/teacher_home"
                >
                  <AccountBalanceIcon />
                  {/* <Icon name="home" size="xl" /> */}
                  <div className="ml-2">Home</div>
                </Link>
              )}
              {role === "office" && (
                <Link
                  className="mr-5 mt-4 sm:mt-0 flex flex-row items-center justify-between ml-5 hover:border-b-2 border-white transition-all hover:ease-in duration-200 hover:border-t-2"
                  to="/office_home"
                >
                  <AccountBalanceIcon />
                  {/* <Icon name="home" size="xl" /> */}
                  <div className="ml-2">Home</div>
                </Link>
              )}
              <Link
                className="mr-5 mt-4 sm:mt-0 flex flex-row items-center justify-between ml-5 hover:border-b-2 border-white transition-all hover:ease-in duration-200 hover:border-t-2"
                to="/session"
              >
                {/* <Icon name="school" size="xl" /> */}
                <ArchiveIcon />
                <div className="ml-2">Archive</div>
              </Link>
              {/* <Link
                className="mr-5 mt-4 sm:mt-0 flex flex-row items-center justify-between ml-5 hover:border-b-2 border-white transition-all hover:ease-in duration-200 hover:border-t-2 text-white"
                onClick={() => console.log("Nice")}
              >
                <Icon name="upload" size="xl" />
                <div className="ml-2">Upload Project</div>
              </Link> */}
              <Link
                className="mr-5 mt-4 sm:mt-0 flex flex-row items-center justify-between ml-5 hover:border-b-2 border-white transition-all hover:ease-in duration-200 hover:border-t-2"
                onClick={handleLogout}
              >
                <Icon name="logout" size="xl" />
                <div className="ml-2">Sign out</div>
              </Link>
              {/* </div> */}
            </NavbarCollapse>
          </NavbarContainer>
        </Navbar>
      )}
    </div>
  );
}

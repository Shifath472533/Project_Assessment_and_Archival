import React, { useState } from "react";
import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavItem from "@material-tailwind/react/NavItem";
import NavLink from "@material-tailwind/react/NavLink";
import NavbarInput from "@material-tailwind/react/NavbarInput";
import Icon from "@material-tailwind/react/Icon";

export default function SearchBar() {
  const [openNavbar, setOpenNavbar] = useState(false);

  return (
    <Navbar color="teal" navbar>
      <NavbarContainer>
        <NavbarWrapper>
          <NavbarBrand>Navbar</NavbarBrand>
          <NavbarToggler
            color="white"
            onClick={() => setOpenNavbar(!openNavbar)}
            ripple="light"
          />
        </NavbarWrapper>

        <NavbarCollapse open={openNavbar}>
          <NavbarInput type="text" placeholder="Search here" />
        </NavbarCollapse>
      </NavbarContainer>
    </Navbar>
  );
}

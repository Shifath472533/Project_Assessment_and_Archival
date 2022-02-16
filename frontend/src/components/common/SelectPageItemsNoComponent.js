import React, { useState } from "react";
import Dropdown from "@material-tailwind/react/Dropdown";
// import DropdownItem from "@material-tailwind/react/DropdownItem";
import DropdownLink from "@material-tailwind/react/DropdownLink";

export default function SelectPageItemsNoComponent(props) {
  const { mainColor, color, type, ripple, setPageSize } = props;
  const [pageSizes, setPageSizes] = useState([5, 10, 25, 50, 100]);
  return (
    <div>
      <Dropdown
        color={color}
        placement="bottom"
        buttonText="Rows per Page"
        buttonType={type}
        size="regular"
        rounded={false}
        block={false}
        ripple={ripple}
      >
        {pageSizes.map((pageSize) => {
          return (
            <DropdownLink
              onClick={(e) => setPageSize(pageSize)}
              color={mainColor}
              ripple="light"
            >
              {pageSize}
            </DropdownLink>
          );
        })}
      </Dropdown>
    </div>
  );
}

import React from "react";
import image from "../assets/images/errorpage.png";
const errorPage = () => {
  return (
    <div>
      <img
        className="w-screen h-screen"
        src={image}
        alt="Error 404 Not Found"
      />
      ;
    </div>
  );
};

export default errorPage;

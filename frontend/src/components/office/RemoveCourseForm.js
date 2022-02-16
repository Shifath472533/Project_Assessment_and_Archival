import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { useLocation, useHistory } from "react-router-dom";
import Card from "@material-tailwind/react/Card";
// import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import CardFooter from "@material-tailwind/react/CardFooter";
// import H5 from "@material-tailwind/react/Heading5";
import Input from "@material-tailwind/react/Input";
import Button from "@material-tailwind/react/Button";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
// import Select from "@material-ui/core/Select";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
// import FormControl from "@material-ui/core/FormControl";
import { removeCourse } from "Services/OfficeService";
import "../../components/loader/Loader6.css";
// import FormatDate from "../../utilityFuctions/FormatDate";
import { ToastContainer, toast } from "react-toastify";

toast.configure();

export default function RemoveCourseForm() {
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(false);

  const [code, setCode] = useState("");

  const handleCode = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCode("");
    setShowLoading(true);
    console.log(code);
    const { success, msg, data } = await removeCourse(code);
    console.log(success, msg, data);
    setShowLoading(false);
    if (success) {
      toast.success(" Removed Course successfully");
    } else {
      toast.error(" Unable to Remove Course");
    }
    history.push({
      pathname: "/add_course",
      // search: "?query=abc",
      state: { success: success, msg: msg },
    });
  };

  return (
    <div className="w-full flex flex-col">
      {showLoading && (
        <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
          <span className="loader6"></span>
        </div>
      )}
      <div className="w-full flex flex-row justify-between my-1 sm:my-10 items-center">
        <Card className="w-full border-t-4 mx-1 sm:mx-10 lg:mx-20">
          <CardBody>
            <div className="mb-10 px-4">
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
          </CardBody>
          <CardFooter>
            <div className="flex justify-center">
              <Button
                color="teal"
                buttonType="filled"
                size="lg"
                ripple="dark"
                onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

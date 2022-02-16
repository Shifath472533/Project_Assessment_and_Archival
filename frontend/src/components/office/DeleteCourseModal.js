import React, { useState } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
// import Input from "@material-tailwind/react/Input";

export default function DeleteCourseModal(props) {
  const {
    showDeleteCourseModal,
    setShowDeleteCourseModal,
    courseToBeDeleted,
    handleCourseDelete,
  } = props;

  const [buttonText, setButtonText] = useState("Copy");

  const handleCourseCodeCopy = (courseToBeDeleted) => {
    handleCourseDelete(courseToBeDeleted);
    // setButtonText("Copied");
  };

  return (
    <Modal
      size="sm"
      active={showDeleteCourseModal}
      toggler={() => setShowDeleteCourseModal(false)}
    >
      <ModalHeader toggler={() => setShowDeleteCourseModal(false)}>
        Are you sure ?
      </ModalHeader>
      <ModalBody>
        <div>
          You can't delete the course{" "}
          <b className="text-lg text-green-600">{courseToBeDeleted.title}</b>{" "}
          directly.
          <br></br>
          To delete this course copy the course code by pressing copy button
          below and follow this path:<br></br>
          <b className="text-red-500">
            Home {">>"} Management {">>"} Add/Remove Course {">>"} Remove Course
          </b>
          .<br></br> Then paste the code and submit.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowDeleteCourseModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>

        <Button
          color="red"
          onClick={(e) => handleCourseCodeCopy(courseToBeDeleted)}
          ripple="light"
        >
          {buttonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

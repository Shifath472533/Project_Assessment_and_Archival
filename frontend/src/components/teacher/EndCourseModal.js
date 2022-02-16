import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
// import Input from "@material-tailwind/react/Input";

export default function EndCourseModal(props) {
  const { course, showEndCourseModal, setShowEndCourseModal, handleEndCourse } =
    props;

  return (
    <Modal
      size="sm"
      active={showEndCourseModal}
      toggler={() => setShowEndCourseModal(false)}
    >
      <ModalHeader toggler={() => setShowEndCourseModal(false)}>
        Attention!!!
      </ModalHeader>
      <ModalBody>
        <div>
          {course.title} ({course.code}) of {course.year} will be ended. You
          will not be able to edit it further.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowEndCourseModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>

        <Button
          color="red"
          onClick={(e) => handleEndCourse(course)}
          ripple="light"
        >
          End
        </Button>
      </ModalFooter>
    </Modal>
  );
}

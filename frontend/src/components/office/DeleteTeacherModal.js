import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
// import Input from "@material-tailwind/react/Input";

export default function DeleteTeacherModal(props) {
  const {
    showDeleteTeacherModal,
    setShowDeleteTeacherModal,
    teacherToBeDeleted,
    handleTeacherDelete,
  } = props;

  return (
    <Modal
      size="sm"
      active={showDeleteTeacherModal}
      toggler={() => setShowDeleteTeacherModal(false)}>
      <ModalHeader toggler={() => setShowDeleteTeacherModal(false)}>
        Are you sure ?
      </ModalHeader>
      <ModalBody>
        <div>{teacherToBeDeleted.name} will be deleted</div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowDeleteTeacherModal(false)}
          ripple="dark">
          Cancel
        </Button>

        <Button
          color="red"
          onClick={(e) => handleTeacherDelete(teacherToBeDeleted)}
          ripple="light">
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}

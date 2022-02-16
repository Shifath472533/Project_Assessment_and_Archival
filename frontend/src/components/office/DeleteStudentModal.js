import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
// import Input from "@material-tailwind/react/Input";

export default function DeleteStudentModal(props) {
  const {
    showDeleteStudentModal,
    setShowDeleteStudentModal,
    studentToBeDeleted,
    handleStudentDelete,
  } = props;

  return (
    <Modal
      size="sm"
      active={showDeleteStudentModal}
      toggler={() => setShowDeleteStudentModal(false)}>
      <ModalHeader toggler={() => setShowDeleteStudentModal(false)}>
        Are you sure ?
      </ModalHeader>
      <ModalBody>
        <div>{studentToBeDeleted.name} will be deleted</div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowDeleteStudentModal(false)}
          ripple="dark">
          Cancel
        </Button>

        <Button
          color="red"
          onClick={(e) => handleStudentDelete(studentToBeDeleted)}
          ripple="light">
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}

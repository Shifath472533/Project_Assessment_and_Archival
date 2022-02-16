import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
// import Input from "@material-tailwind/react/Input";

export default function DeleteTaskModal(props) {
  const {
    showDeleteTaskModal,
    setShowDeleteTaskModal,
    taskToBeDeleted,
    handleTaskDelete,
  } = props;

  return (
    <Modal
      size="sm"
      active={showDeleteTaskModal}
      toggler={() => setShowDeleteTaskModal(false)}>
      <ModalHeader toggler={() => setShowDeleteTaskModal(false)}>
        Are you sure ?
      </ModalHeader>
      <ModalBody>
        <div>{taskToBeDeleted.title} will be deleted</div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowDeleteTaskModal(false)}
          ripple="dark">
          Cancel
        </Button>

        <Button
          color="red"
          onClick={(e) => handleTaskDelete(taskToBeDeleted)}
          ripple="light">
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}

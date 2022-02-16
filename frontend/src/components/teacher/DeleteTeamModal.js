import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
// import Input from "@material-tailwind/react/Input";

export default function DeleteTeamModal(props) {
  const {
    showDeleteTeamModal,
    setShowDeleteTeamModal,
    teamToBeDeleted,
    handleTeamDelete,
  } = props;

  return (
    <Modal
      size="sm"
      active={showDeleteTeamModal}
      toggler={() => setShowDeleteTeamModal(false)}
    >
      <ModalHeader toggler={() => setShowDeleteTeamModal(false)}>
        Are you sure ?
      </ModalHeader>
      <ModalBody>
        <div>{teamToBeDeleted.title} will be deleted</div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowDeleteTeamModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>

        <Button
          color="red"
          onClick={(e) => handleTeamDelete(teamToBeDeleted)}
          ripple="light"
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}

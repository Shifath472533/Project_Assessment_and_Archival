import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Input from "@material-tailwind/react/Input";

export default function EditTeamModal(props) {
  const {
    showEditTeamModal,
    setShowEditTeamModal,
    handleTeamSave,
    handleTeamTitleChange,
    editedTeamTitle,
  } = props;

  return (
    <Modal
      size="sm"
      active={showEditTeamModal}
      toggler={() => setShowEditTeamModal(false)}
    >
      <ModalHeader toggler={() => setShowEditTeamModal(false)}>
        Update Team Title
      </ModalHeader>
      <ModalBody>
        <Input
          type="text"
          color="lightBlue"
          size="regular"
          outline={false}
          value={editedTeamTitle}
          placeholder=""
          onChange={handleTeamTitleChange}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowEditTeamModal(false)}
          ripple="dark"
        >
          Close
        </Button>

        <Button
          color="green"
          onClick={(e) => handleTeamSave(editedTeamTitle)}
          ripple="light"
        >
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
}

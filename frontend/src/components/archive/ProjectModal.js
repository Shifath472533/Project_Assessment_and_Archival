// import React from "react";
import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Card from "@material-tailwind/react/Card";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
import { Link } from "react-router-dom";
import Chip from "@material-ui/core/Chip";

export default function ProjectModal(props) {
  const {
    showModal,
    setShowModal,
    projectName,
    projectDecription,
    projectFileName,
    projectFileSize,
    path,
    tag,
  } = props;

  const [rawContent, setRawContent] = useState({
    blocks: [
      {
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "2vm6d",
        text: "No content",
        type: "header-six",
      },
    ],
    entityMap: {},
  });
  const displayEditorConfig = {
    toolbar: { visible: false },
    draftEditor: { readOnly: true },
    editor: {
      wrapperElement: "div",
      style: {
        padding: 5,
        marginBottom: 10,
        // borderTop: "1px solid gray",
      },
    },
  };
  const [displayEditorState, setDisplayEditorState] = React.useState(
    MUIEditorState.createWithContent(
      displayEditorConfig,
      convertFromRaw({
        blocks: [
          {
            data: {},
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            key: "2vm6d",
            text: "No content",
            type: "header-six",
          },
        ],
        entityMap: {},
      })
    )
  );
  const onDisplayEditorChange = (newState) => {
    setDisplayEditorState(newState);
  };

  useEffect(() => {
    if (projectName) {
      console.log(path);
      console.log("tag", tag);
      const desc = { ...projectDecription };
      if (!("entityMap" in desc)) {
        desc["entityMap"] = {};
      }
      setDisplayEditorState(
        MUIEditorState.createWithContent(
          displayEditorConfig,
          convertFromRaw(desc)
        )
      );
    }
  }, [projectName]);

  return (
    <>
      <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader toggler={() => setShowModal(false)}>
          {projectName}
        </ModalHeader>
        <ModalBody className="min-w-full">
          <div className="w-full flex flex-col justify-center items-stretch">
            <div className="flex flex-col justify-evenly mx-1 items-center lg:mx-10">
              {/* <div className="flex flex-col w-9/12 content-center justify-center my-3 border-t-4 border-gray-600 rounded-2xl">
                <Card className="bg-blue-500">
                  <div className="text-white text-xl">
                    {projectName}
                    Project Title
                  </div>
                </Card>
              </div> */}
              <div className="my-3 w-full border-t-4 border-gray-200 rounded-2xl">
                <Card>
                  {/* {description !== 0 && ( */}
                  <MUIEditor
                    editorState={displayEditorState}
                    onChange={onDisplayEditorChange}
                    config={displayEditorConfig}
                  />
                  {/*  )} */}
                </Card>
              </div>
              <div className="flex flex-col w-full content-center justify-center my-3 border-t-4 border-gray-600 rounded-2xl">
                <Card className="bg-blue-500">
                  <div className="text-white text-sm">
                    File Size : {projectFileSize}
                  </div>
                </Card>
              </div>
              <div class="w-full flex flex-row flex-wrap justify-start">
                {tag.map((t) => (
                  <div className="text-purple-500 bg-center border-2 border-purple-500 text-white mx-2 my-1 px-2 shadow-md rounded-md">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            onClick={(e) => setShowModal(false)}
            ripple="dark"
          >
            Cancel
          </Button>

          {/* <a href={path} download>
            Click to download
          </a> */}

          {/* <Link
            className="bg-green-500 text-md text-white rounded-lg shadow-lg hover:shadow-2xl px-5 py-2"
            to={`${path}`}
            target="_blank"
            download
          >
            Download
          </Link> */}

          <Button
            color="green"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = path;
            }}
            ripple="light"
          >
            Download
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

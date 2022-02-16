import React from "react";
// import React, { useState } from "react";
import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import Button from "@material-tailwind/react/Button";
import ProjectModal from "./ProjectModal";
import H4 from "@material-tailwind/react/Heading4";

export default function ProjectCard(props) {
  const [showModal, setShowModal] = React.useState(false);

  const {
    projectName,
    projectDecription,
    projectFileName,
    projectFileSize,
    projectMembers,
    tag,
  } = props;

  console.log("projectMembers ", projectMembers);
  const path_ = `http://localhost:5000/archiveFiles/${projectFileName}`;

  // const fileName = "20217182720_Menlo-for-Powerline-master.zip";
  // const path_ = `http://localhost:5000/archiveFiles/${fileName}`; // For Archive folder
  // const path2 = `http://localhost:5000/uploadFiles/${fileName}`; // For upload folder
  // const projectName = "Project Name";
  // const projectDecription =
  // 	"I always felt like I could do anything. That’s the main thing people are controlled by! Thoughts- their perception of themselves! They're slowed down by their perception of themselves. If you're taught you can’t do anything, you won’t do anything. I was taught I could do everything.";
  // const projectFileName = "project_name";
  // const projectFileSize = "20MB";
  // const projectMembers = ["2016331001", "2016331022", "2016331103"];

  return (
    <div className="mx-2 my-8">
      <ProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
        projectName={projectName}
        projectDecription={projectDecription}
        projectFileName={projectFileName}
        projectFileSize={projectFileSize}
        path={path_}
        tag={tag}
      />
      <Card>
        <CardHeader className="text-center" color="lightBlue">
          <H4 color="white">{projectName}</H4>
        </CardHeader>
        <div className="flex flex-col justify-between items-center">
          <div className="my-4 w-9/12">
            <div className="text-xl mb-3 font-bold text-blue-800 border-gray-400 border-b-4">
              Project Members
            </div>
            {projectMembers.map((member) => {
              return (
                <div className="text-center border-l-4 border-r-4 border-green-500 bg-green-100 my-1 text-green-900 font-semibold">
                  {member.username}
                </div>
              );
            })}
          </div>

          <Button
            color="green"
            buttonType="filled"
            size="regular"
            rounded={false}
            block={false}
            iconOnly={false}
            ripple="light"
            onClick={(e) => setShowModal(true)}
            path__={path_}>
            See Details
          </Button>
        </div>
      </Card>
    </div>
  );
}

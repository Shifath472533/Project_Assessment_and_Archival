import React, { useState } from "react";
import Tab from "@material-tailwind/react/Tab";
import TabList from "@material-tailwind/react/TabList";
import TabItem from "@material-tailwind/react/TabItem";
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
import Icon from "@material-tailwind/react/Icon";
// import { convertToRaw, convertFromRaw } from "draft-js";
import MUIEditor from "react-mui-draft-wysiwyg";
// import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import Card from "@material-tailwind/react/Card";

export default function TabPanel(props) {
  const [openTab, setOpenTab] = useState(1);
  const {
    editorConfig,
    editorState,
    // setEditorState,
    onChange,
    // rawContent,
    // setRawContent,
    displayEditorConfig,
    displayEditorState,
    // setDisplayEditorState,
    onDisplayEditorChange,
  } = props;

  return (
    <Tab className="border-t-4 border-gray-200 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center justify-center py-5">
        <div className="flex content-center">
          <TabList
            className="flex flex-col sm:flex-row md:flex-col"
            color="teal"
          >
            <TabItem
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(1);
              }}
              ripple="light"
              active={openTab === 1 ? true : false}
              href="tabItem"
            >
              <Icon name="language" size="lg" />
              Discover
            </TabItem>
            <TabItem
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(2);
              }}
              ripple="light"
              active={openTab === 2 ? true : false}
              href="tabItem"
            >
              <Icon name="account_circle" size="lg" />
              Profile
            </TabItem>
          </TabList>
        </div>

        <div className="ml-0 md:ml-0 flex-grow w-full">
          <TabContent>
            <TabPane active={openTab === 1 ? true : false}>
              <div className="flex flex-col justify-evenly items-center">
                <div className="bg-gray-200 p-2 rounded-md shadow-md">
                  <MUIEditor
                    className="flex flex-row align-middle"
                    editorState={editorState}
                    onChange={onChange}
                    config={editorConfig}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane
              className=" w-full"
              active={openTab === 2 ? true : false}
            >
              <div className="flex flex-col justify-evenly items-center w-full">
                {/* <Card className="bg-gray-200 p-2 rounded-md shadow-md mt-5"> */}
                <Card className="border-t-4 border-gray-300 rounded-2xl p-2 mt-5">
                  <MUIEditor
                    editorState={displayEditorState}
                    onChange={onDisplayEditorChange}
                    config={displayEditorConfig}
                  />
                </Card>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </div>
    </Tab>
  );
}

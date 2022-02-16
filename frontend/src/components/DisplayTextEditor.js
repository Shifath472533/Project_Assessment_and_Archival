import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertFromRaw } from "draft-js";
import React from "react";
// import React,{ useState }  from "react";


export default function DisplayTextEditor(props) {
  const { rawContent } = props;
  // const [rawContent, setRawContent] = useState(props.rawContent);
  // const [rawContent, setRawContent] = useState({
  //   blocks: [
  //     {
  //       key: "e4lom",
  //       text: "Wow! Nice article Jane Doe!",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [
  //         { offset: 0, length: 3, style: "BOLD" },
  //         { offset: 18, length: 8, style: "ITALIC" },
  //       ],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "c128v",
  //       text: "",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "5uoeh",
  //       text: "I would recommend it to everyone.",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [
  //         { offset: 24, length: 8, style: "BOLD" },
  //         { offset: 24, length: 8, style: "FONT_COLOR-rgb(255, 0, 0)" },
  //       ],
  //       entityRanges: [],
  //       data: {},
  //     },
  //     {
  //       key: "2cvur",
  //       text: " ",
  //       type: "atomic",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [{ offset: 0, length: 1, key: 0 }],
  //       data: {},
  //     },
  //     {
  //       key: "27uqd",
  //       text: "",
  //       type: "unstyled",
  //       depth: 0,
  //       inlineStyleRanges: [],
  //       entityRanges: [],
  //       data: {},
  //     },
  //   ],
  //   entityMap: {
  //     0: {
  //       type: "IMAGE",
  //       mutability: "IMMUTABLE",
  //       data: {
  //         src: "https://picsum.photos/200/300",
  //         width: 200,
  //         height: 300,
  //       },
  //     },
  //   },
  // });
  // // setRawContent(props.rawContent);
  const displayEditorConfig = {
    toolbar: { visible: false },
    draftEditor: { readOnly: true },
    editor: {
      wrapperElement: "div",
      style: {
        padding: 0,
        borderTop: "1px solid gray",
      },
    },
  };
  const [displayEditorState, setDisplayEditorState] = React.useState(
    MUIEditorState.createWithContent(
      displayEditorConfig,
      convertFromRaw(rawContent)
    )
  );
  const onDisplayEditorChange = (newState) => {
    setDisplayEditorState(newState);
  };
  return (
    <>
      <MUIEditor
        editorState={displayEditorState}
        onChange={onDisplayEditorChange}
        config={displayEditorConfig}
      />
    </>
  );
}

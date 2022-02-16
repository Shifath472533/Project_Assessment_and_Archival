// import axios from "axios";
import React, { Component } from "react";
import Button from "@material-tailwind/react/Button";

class FileUploader extends Component {
  render() {
    const { color } = this.props;
    const { onFileChange } = this.props;
    return (
      <div>
        <div>
          <div>
            <div className="file-uploader">
              <input
                type="file"
                style={{ display: "none" }}
                onChange={onFileChange}
                ref={(fileInput) => (this.fileInput = fileInput)}
              />
              <Button
                color={color ? color : "lightBlue"}
                onClick={(e) => this.fileInput.click()}
              >
                Choose File
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileUploader;

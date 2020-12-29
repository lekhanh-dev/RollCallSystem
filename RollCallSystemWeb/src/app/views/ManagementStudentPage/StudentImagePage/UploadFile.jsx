import React, { Component } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@material-ui/core";
import {
  uploadFiles,
  getFiles,
  saveFileName,
  trainingData,
} from "./ImageService";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: undefined,
      progressInfos: [],
      message: null,

      fileInfos: [],
    };
  }

  componentDidMount() {
    getFiles(this.props.studentCode).then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }

  selectFiles = (event) => {
    console.log(event.target.files);
    this.setState({
      progressInfos: [],
      selectedFiles: event.target.files,
    });
  };

  upload = (idx, file) => {
    let _progressInfos = [...this.state.progressInfos];

    uploadFiles(
      file,
      (event) => {
        console.log(event);
        _progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total
        );
        console.log(_progressInfos);
        this.setState({
          _progressInfos,
        });
      },
      this.props.studentCode
    )
      .then((response) => {
        this.setState((prev) => {
          let prevMessage = prev.message ? prev.message + "\n" : "";
          return {
            message: prevMessage + response.data.message,
          };
        });
        saveFileName(this.props.studentCode);
        trainingData();
        return getFiles(this.props.studentCode);
      })
      .then((files) => {
        this.props.updateImage();
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        this.setState({
          progressInfos: _progressInfos,
          message: "Không thể tải hình ảnh lên",
        });
      });
  };

  handleUploadFiles = () => {
    const selectedFiles = this.state.selectedFiles;

    let _progressInfos = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
    }

    this.setState(
      {
        progressInfos: _progressInfos,
        message: null,
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);
        }
      }
    );
  };

  render() {
    const { selectedFiles, progressInfos, message } = this.state;
    return (
      <div>
        {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div key={index} className="mb-2">
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%" }}
                >
                  {progressInfo.percentage}%
                </div>
              </div>
            </div>
          ))}

        <label className="btn btn-default">
          <input type="file" multiple onChange={this.selectFiles} />
        </label>

        <Button
          className="mb-16"
          variant="contained"
          color="primary"
          disabled={!selectedFiles || selectedFiles.length === 0}
          onClick={this.handleUploadFiles}
        >
          Tải lên
        </Button>
        {message && (
          <div className="alert alert-light" role="alert">
            <ul>
              {message.split("\n").map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </div>
        )}

        {/* <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                  <img
                    src={file.url}
                    alt="Girl in a jacket"
                    width="500"
                    height="600"
                  ></img>
                </li>
              ))}
          </ul>
        </div> */}
      </div>
    );
  }
}

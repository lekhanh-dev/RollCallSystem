import React, { Component } from "react";
import { Breadcrumb, ConfirmationDialog } from "matx";
import { Card, Icon, IconButton } from "@material-ui/core";
import {
  getStudent,
  getFiles,
  deleteImage,
  trainingData,
} from "./ImageService";
import UploadFile from "./UploadFile";

class ImagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentCode: this.getStudentCode(this.props.location.pathname),
      studentName: "",
      sumImage: 0,
      notFound: false,
      listImage: [],
      shouldOpenConfirmationDialog: false,
      imageName: "",
    };

    getStudent(this.state.studentCode)
      .then((res) => {
        console.log(res.data);
        this.setState({
          studentName: res.data.name,
          sumImage: this.handleImage(res.data.imageList),
        });
        console.log("Has found students");
      })
      .catch((err) => {
        console.log("Students not exist");
        this.setState({ notFound: true });
      });

    getFiles(this.state.studentCode)
      .then((res) => {
        this.setState({
          listImage: res.data,
        });
      })
      .catch((err) => {
        console.log("Image not exist");
      });
  }

  getStudentCode = (str) => {
    let array = str.split("/");
    return array[array.length - 1];
  };

  updateImage = () => {
    getStudent(this.state.studentCode)
      .then((res) => {
        this.setState({
          sumImage: this.handleImage(res.data.imageList),
        });
        console.log("Has found students");
      })
      .catch((err) => {
        console.log("Students not exist");
        this.setState({ notFound: true });
      });
    getFiles(this.state.studentCode)
      .then((res) => {
        this.setState({
          listImage: res.data,
        });
      })
      .catch((err) => {
        console.log("Image not exist");
      });
  };

  handleImage = (imageList) => {
    if (!imageList) {
      return 0;
    } else {
      let sum = imageList.split(";").length - 1;
      return sum;
    }
  };

  handleDeleteImage = (imageName) => {
    this.setState({
      shouldOpenConfirmationDialog: true,
      imageName: imageName,
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
    });
  };

  handleConfirmationResponse = () => {
    deleteImage(this.state.imageName, this.state.studentCode).then(() => {
      trainingData();
      alert("Xóa ảnh thành công");
      this.setState(
        {
          shouldOpenConfirmationDialog: false,
          sumImage: this.state.sumImage - 1,
        },
        () => {
          getStudent(this.state.studentCode)
            .then((res) => {
              this.setState({
                studentName: res.data.name,
                sumImage: this.handleImage(res.data.imageList),
              });
              console.log("Has found students");
            })
            .catch((err) => {
              console.log("Students not exist");
              this.setState({ notFound: true });
            });

          getFiles(this.state.studentCode)
            .then((res) => {
              this.setState({
                listImage: res.data,
              });
            })
            .catch((err) => {
              console.log("Image not exist");
            });
        }
      );
    });
  };

  render() {
    let {
      studentCode,
      studentName,
      sumImage,
      listImage,
      shouldOpenConfirmationDialog,
    } = this.state;
    // console.log(this.state);
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb
            routeSegments={[
              { name: "Quản lý sinh viên", path: "/management/students" },
              { name: "Hình ảnh", path: "/management/students" },
              { name: studentCode },
            ]}
          />
        </div>
        <Card elevation={3} className="pt-20 mb-24">
          <div className="card-title px-24 mb-12">{`${studentName} : ${sumImage} hình ảnh`}</div>
          <div className="image-wrapper">
            <ul className="ul-image">
              {listImage.map((image, index) => {
                return (
                  <li key={index} className="li-image">
                    <div className="my-image-wrapper">
                      <IconButton
                        className="my-icon-image"
                        onClick={() => this.handleDeleteImage(image.name)}
                      >
                        <Icon color="error">delete</Icon>
                      </IconButton>
                      <img
                        className="my-image"
                        src={image.url}
                        alt={image.url + index}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
        <div className="py-12" />
        <Card elevation={3} className="pt-20 mb-24">
          <div className="card-title px-24 mb-12">Thêm ảnh cho sinh viên</div>
          <div className="card-title px-24 mb-12">
            <UploadFile
              studentCode={studentCode}
              updateImage={this.updateImage}
            />
          </div>
        </Card>
        {shouldOpenConfirmationDialog && (
          <ConfirmationDialog
            open={shouldOpenConfirmationDialog}
            onConfirmDialogClose={this.handleDialogClose}
            onYesClick={this.handleConfirmationResponse}
            loadingCircularProgress={false}
            text="Bạn có chắc chắn muốn xóa ảnh này"
          />
        )}
      </div>
    );
  }
}

export default ImagePage;

import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  CircularProgress,
  withStyles,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addSubject, updateSubject } from "./SubjectService";

const styles = (theme) => ({
  wrapper: {
    position: "relative",
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
});

class SubjectDialog extends Component {
  state = {
    code: "",
    name: "",
    loading: false,
  };

  componentDidMount() {
    if (this.props.option === "update") {
      this.setState({
        code: this.props.subject.code,
        name: this.props.subject.name,
      });
    }

    ValidatorForm.addValidationRule("checkSubjectCode", (value) => {
      if (value.length > 10) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkSubjectName", (value) => {
      if (value.length > 200) {
        return false;
      }
      return true;
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFormSubmit = (option) => {
    this.setState({ loading: true });
    switch (option) {
      case "addNew":
        addSubject({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Thêm mới môn học thành công");
            }, 500);
          })
          .catch((error) => {
            if (!error.response) {
              alert("Máy chủ đang bận, mời bạn thử lại");
            } else {
              this.props.handleClose(false, error.response.data);
            }
            this.setState({ loading: false });
          });
        break;
      case "update":
        updateSubject({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Cập nhập môn học thành công");
            }, 500);
          })
          .catch((error) => {
            if (!error.response) {
              alert("Máy chủ đang bận, mời bạn thử lại");
            } else {
              this.props.handleClose(false, error.response.data);
            }
            this.setState({ loading: false });
          });
        break;
      default:
        break;
    }
  };

  render() {
    let { code, name, loading } = this.state;
    let { open, handleClose, option, classes } = this.props;
    let titleForDialog = null;
    switch (option) {
      case "addNew":
        titleForDialog = "Thêm mới môn học";
        break;
      case "update":
        titleForDialog = "Cập nhập môn học";
        break;
      default:
        break;
    }

    return (
      <Dialog
        onClose={(open, data) => {
          handleClose(open, data);
        }}
        open={open}
      >
        <div className="p-24">
          <h4 className="mb-20">{titleForDialog}</h4>
          <ValidatorForm
            ref="form"
            onSubmit={() => this.handleFormSubmit(option)}
          >
            <Grid className="mb-16" container>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label="Mã môn học"
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required", "checkSubjectCode"]}
                  errorMessages={[
                    "Trường này không được để trống",
                    "Mã môn học không vượt quá 10 kí tự",
                  ]}
                  disabled={option === "update" ? true : false}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label="Tên môn học"
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required", "checkSubjectName"]}
                  errorMessages={[
                    "Trường này không được để trống",
                    "Tên môn học không vượt quá 200 kí tự",
                  ]}
                />
              </Grid>
              <Grid item sm={12} xs={12} className="hidden-special-mycss">
                <TextValidator />
              </Grid>
            </Grid>

            <div className="flex flex-space-between flex-middle">
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  Lưu
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
              <Button onClick={() => this.props.handleClose()}>Cancel</Button>
            </div>
          </ValidatorForm>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SubjectDialog);

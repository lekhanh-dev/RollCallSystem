import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  CircularProgress,
  withStyles,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  addTeachers,
  updateTeachers,
  createTeacherAccount,
} from "./TeacherService";

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

  text: {
    fontSize: "1rem",
    fontWeight: 100,
  },
});

class TeacherDialog extends Component {
  state = {
    code: "",
    name: "",
    username: "",
    password: "",
    loading: false,
  };

  componentDidMount() {
    if (this.props.option === "update") {
      this.setState({
        code: this.props.teacher.code,
        name: this.props.teacher.name,
      });
    }

    if (this.props.option === "createAccount") {
      this.setState({
        code: this.props.teacher.code,
        username: this.props.teacher.code,
        password: this.props.teacher.code,
      });
    }

    ValidatorForm.addValidationRule("checkTeacherCode", (value) => {
      if (value.length > 10) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkTeacherName", (value) => {
      if (value.length > 50) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkUsername", (value) => {
      if (value.length > 30) {
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
        addTeachers({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Thêm mới giáo viên thành công");
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
        updateTeachers({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Cập nhập giáo viên thành công");
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
      case "createAccount":
        createTeacherAccount({
          ...this.state,
          role: "ROLE_TEACHER",
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Tạo tài khoản thành công");
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
    let { code, name, loading, username } = this.state;
    let { open, handleClose, option, classes } = this.props;
    let titleForDialog = null;
    switch (option) {
      case "addNew":
        titleForDialog = "Thêm mới giáo viên";
        break;
      case "update":
        titleForDialog = "Cập nhập giáo viên";
        break;
      case "createAccount":
        titleForDialog = "Tạo tài khoản";
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
            {option === "createAccount" ? (
              <Grid className="mb-16" container>
                <Grid item sm={12} xs={12}>
                  <TextValidator
                    className="w-100 mb-16"
                    label="Tên tài khoản"
                    onChange={this.handleChange}
                    type="text"
                    name="username"
                    value={username}
                    validators={["required", "checkUsername"]}
                    errorMessages={[
                      "Trường này không được để trống",
                      "Tên tài khoản không vượt quá 30 kí tự",
                    ]}
                    disabled={option === "update" ? true : false}
                  />
                </Grid>
                <h1 className={classes.text}>
                  * Mật khẩu mặc định là mã giáo viên
                </h1>
              </Grid>
            ) : (
              <Grid className="mb-16" container>
                <Grid item sm={12} xs={12}>
                  <TextValidator
                    className="w-100 mb-16"
                    label="Mã giáo viên"
                    onChange={this.handleChange}
                    type="text"
                    name="code"
                    value={code}
                    validators={["required", "checkTeacherCode"]}
                    errorMessages={[
                      "Trường này không được để trống",
                      "Mã giáo viên không vượt quá 10 kí tự",
                    ]}
                    disabled={option === "update" ? true : false}
                  />
                  <TextValidator
                    className="w-100 mb-16"
                    label="Tên giáo viên"
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    value={name}
                    validators={["required", "checkTeacherName"]}
                    errorMessages={[
                      "Trường này không được để trống",
                      "Tên giáo viên không vượt quá 50 kí tự",
                    ]}
                  />
                </Grid>
                <Grid item sm={12} xs={12} className="hidden-special-mycss">
                  <TextValidator />
                </Grid>
              </Grid>
            )}
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

export default withStyles(styles, { withTheme: true })(TeacherDialog);

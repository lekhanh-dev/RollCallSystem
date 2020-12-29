import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  CircularProgress,
  withStyles,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addSemester, updateSemester } from "./SemesterService";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";

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

class SemesterDialog extends Component {
  state = {
    code: "",
    semesterName: "",
    startDate: new Date(),
    endDate: new Date(),
    loading: false,
  };

  componentDidMount() {
    if (this.props.option === "update") {
      this.setState({
        code: this.props.semester.code,
        semesterName: this.props.semester.semesterName,
        startDate: this.props.semester.startDate,
        endDate: this.props.semester.endDate,
      });
    }

    ValidatorForm.addValidationRule("checkSemesterCode", (value) => {
      if (value.length > 15) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkSemesterName", (value) => {
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

  handleDateChange = (date, label) => {
    // console.log(format(date, "yyyy-MM-dd"));
    this.setState({ [label]: date });
  };

  handleFormSubmit = (option) => {
    this.setState({ loading: true });
    switch (option) {
      case "addNew":
        addSemester({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Thêm mới học kỳ thành công");
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
        updateSemester({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Cập nhập học kỳ thành công");
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
    let { code, semesterName, startDate, endDate, loading } = this.state;
    let { open, handleClose, option, classes } = this.props;
    let titleForDialog = null;
    switch (option) {
      case "addNew":
        titleForDialog = "Thêm mới học kỳ";
        break;
      case "update":
        titleForDialog = "Cập nhập học kỳ";
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
            <Grid className="mb-16" container spacing={4}>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label="Mã học kỳ"
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required", "checkSemesterCode"]}
                  errorMessages={[
                    "Trường này không được để trống",
                    "Mã học kỳ không vượt quá 10 kí tự",
                  ]}
                  disabled={option === "update" ? true : false}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label="Tên học kỳ"
                  onChange={this.handleChange}
                  type="text"
                  name="semesterName"
                  value={semesterName}
                  validators={["required", "checkSemesterName"]}
                  errorMessages={[
                    "Trường này không được để trống",
                    "Tên học kỳ không vượt quá 200 kí tự",
                  ]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                  <KeyboardDatePicker
                    autoOk
                    className="w-100 mb-16"
                    variant="inline"
                    label="Ngày bắt đầu"
                    format="dd/MM/yyyy"
                    value={startDate}
                    placeholder={format(new Date(), "dd/MM/yyyy")}
                    minDate={new Date()}
                    InputAdornmentProps={{ position: "start" }}
                    invalidDateMessage="Ngày không hợp lệ"
                    minDateMessage="Ngày không được trước ngày hiện tại"
                    onChange={(date) =>
                      this.handleDateChange(date, "startDate")
                    }
                  />
                  <KeyboardDatePicker
                    autoOk
                    className="w-100 mb-16"
                    variant="inline"
                    label="Ngày kết thúc"
                    format="dd/MM/yyyy"
                    value={endDate}
                    placeholder={format(new Date(), "dd/MM/yyyy")}
                    minDate={new Date()}
                    InputAdornmentProps={{ position: "start" }}
                    minDateMessage="Ngày không được trước ngày hiện tại"
                    invalidDateMessage="Ngày không hợp lệ"
                    onChange={(date) => this.handleDateChange(date, "endDate")}
                  />
                </MuiPickersUtilsProvider>
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

export default withStyles(styles, { withTheme: true })(SemesterDialog);

import React, { Component, Fragment } from "react";
import {
  Dialog,
  Button,
  Grid,
  CircularProgress,
  withStyles,
  TextField,
  InputAdornment,
  Icon,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import {
  addClass,
  updateClass,
  addSchedule,
  getSchedule,
  getTeacherForClass,
  addTeacherForClass,
} from "./ClassService";
import { getSubjects } from "../ManagementSubjectPage/SubjectService";
import { getSemesters } from "../ManagementSemesterPage/SemesterService";
import Checkbox from "@material-ui/core/Checkbox";
import {
  arrayToString,
  stringToArray,
  checkExistElementInArray,
} from "../../../utils";

const styles = (theme) => ({
  wrapper: {
    position: "relative",
    marginRight: "1rem",
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

  inputSearch: {
    width: "auto",
    marginBottom: "1rem",
  },
});

class ClassDialog extends Component {
  state = {
    code: "",
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    subjectList: [],
    semesterList: [],
    subject: null,
    semester: null,
    loading: false,
    scheduleObj: {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    },
    teacherList: [],
    teacherListCache: [],
    keywordSearch: "",
    teacherCode: "",
  };

  componentDidMount() {
    getSubjects().then((res) => {
      this.setState({ subjectList: [...res.data] });
    });

    getSemesters().then((res) => {
      this.setState({ semesterList: [...res.data] });
    });

    if (this.props.option === "viewSchedule") {
      getSchedule(this.props.scheduleId)
        .then((res) => {
          let data = res.data;
          let schedule = {
            sunday: stringToArray(data.sunday),
            monday: stringToArray(data.monday),
            tuesday: stringToArray(data.tuesday),
            wednesday: stringToArray(data.wednesday),
            thursday: stringToArray(data.thursday),
            friday: stringToArray(data.friday),
            saturday: stringToArray(data.saturday),
          };
          return schedule;
        })
        .then((data) => {
          this.setState({ scheduleObj: data });
        });
    }

    if (
      this.props.option === "addTeacher" ||
      this.props.option === "updateTeacher"
    ) {
      getTeacherForClass(this.props.classObj.code).then((res) => {
        this.setState({ teacherListCache: res.data });
      });
    }

    if (this.props.option === "update") {
      this.setState({
        code: this.props.classObj.code,
        name: this.props.classObj.name,
        startDate: this.props.classObj.startDate,
        endDate: this.props.classObj.endDate,
        subject: { code: this.props.classObj.subjectCode },
        semester: { code: this.props.classObj.semester },
      });
    }

    ValidatorForm.addValidationRule("checkClassCode", (value) => {
      if (value.length > 20) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkClassName", (value) => {
      if (value.length > 250) {
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

  handleChangeSubject = (event, value) => {
    this.setState({
      subject: value,
    });
  };

  handleChangeSemester = (event, value) => {
    this.setState({
      semester: value,
    });
  };

  handleDateChange = (date, label) => {
    this.setState({ [label]: date });
  };

  handleFormSubmit = (option) => {
    this.setState({ loading: true });
    switch (option) {
      case "addNew":
        addClass({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Thêm mới lớp học phần thành công");
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
        updateClass({
          ...this.state,
        })
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Cập nhập lớp học phần thành công");
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
      case "createSchedule":
        let schedule = {
          sunday: arrayToString(this.state.scheduleObj["sunday"]),
          monday: arrayToString(this.state.scheduleObj["monday"]),
          tuesday: arrayToString(this.state.scheduleObj["tuesday"]),
          wednesday: arrayToString(this.state.scheduleObj["wednesday"]),
          thursday: arrayToString(this.state.scheduleObj["thursday"]),
          friday: arrayToString(this.state.scheduleObj["friday"]),
          saturday: arrayToString(this.state.scheduleObj["saturday"]),
        };
        addSchedule(schedule, this.props.classObj.code)
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              this.props.handleClose(true, "Thêm lịch học thành công");
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
      case "addTeacher":
      case "updateTeacher":
        let obj = {
          teacherCode: this.state.teacherCode,
          classCode: this.props.classObj.code,
        };
        addTeacherForClass(obj)
          .then((data) => {
            setTimeout(() => {
              this.setState({ loading: false });
              if (this.props.option === "addTeacher") {
                this.props.handleClose(true, "Thêm giáo viên thành công");
              }
              if (this.props.option === "updateTeacher") {
                this.props.handleClose(true, "Thay đổi giáo viên thành công");
              }
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

  handleChangeCheckbox = (event) => {
    let name = event.target.name;
    let value = parseInt(event.target.value);
    let checked = event.target.checked;
    if (checked) {
      let objA = { ...this.state.scheduleObj };
      let array = objA[name].slice();
      array.push(value);
      array.sort((a, b) => a - b);
      objA[name] = array;
      this.setState({ scheduleObj: { ...objA } });
    } else {
      let objA = { ...this.state.scheduleObj };
      let filtered = objA[name].filter(function (v) {
        return v !== value;
      });
      objA[name] = filtered;
      this.setState({ scheduleObj: { ...objA } });
    }
  };

  handleChangeRatio = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeSearch = (event, list, listCache) => {
    let nameE = event.target.name;
    let valueE = typeof event === "string" ? event : event.target.value;
    valueE = valueE.replace(/\*|\(|\)|\+|\[|\]|\?|\\/g, "");
    this.setState(
      {
        [nameE]: valueE,
      },
      () => {
        if (valueE !== "") {
          let listObj = [];
          let keyword = this.state[nameE].toLowerCase();
          listObj = this.state[listCache].slice().filter((v, i) => {
            let code = v.code.toLowerCase();
            let name = v.name.toLowerCase();
            return code.search(keyword) !== -1 || name.search(keyword) !== -1;
          });
          this.setState({ [list]: [...listObj] });
        } else {
          this.setState({ [list]: [] });
        }
      }
    );
  };

  render() {
    let {
      code,
      name,
      loading,
      startDate,
      endDate,
      // subject,
      subjectList,
      semesterList,
      scheduleObj,
      teacherList,
      keywordSearch,
      // teacherListCache,
      teacherCode,
    } = this.state;
    console.log(scheduleObj);
    let { open, handleClose, option, classes, classObj } = this.props;
    let titleForDialog = null;
    switch (option) {
      case "addNew":
        titleForDialog = "Thêm mới lớp học phần";
        break;
      case "update":
        titleForDialog = "Cập nhập lớp học phần";
        break;
      case "createSchedule":
        titleForDialog = "Tạo lịch trình";
        break;
      case "viewSchedule":
        titleForDialog = "Xem lịch trình";
        break;
      case "addTeacher":
        titleForDialog = "Thêm giáo viên";
        break;
      case "updateTeacher":
        titleForDialog = "Thay đổi giáo viên";
        break;
      default:
        break;
    }

    let checkboxArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    return (
      <Dialog
        fullScreen
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
            {option === "addNew" || option === "update" ? (
              <Grid className="mb-16" container>
                <Grid item sm={2} xs={12}>
                  <TextValidator
                    className="w-100 mb-16"
                    label="Mã lớp học"
                    onChange={this.handleChange}
                    type="text"
                    name="code"
                    value={code}
                    validators={["required", "checkClassCode"]}
                    errorMessages={[
                      "Trường này không được để trống",
                      "Mã lớp học phần không vượt quá 20 kí tự",
                    ]}
                    disabled={option === "update" ? true : false}
                  />
                  <TextValidator
                    className="w-100 mb-16"
                    label="Tên lớp học"
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    value={name}
                    validators={["required", "checkClassName"]}
                    errorMessages={[
                      "Trường này không được để trống",
                      "Tên lớp học phần không vượt quá 250 kí tự",
                    ]}
                  />
                </Grid>
                <Grid item sm={2} xs={12} style={{ marginLeft: "2rem" }}>
                  <Autocomplete
                    options={subjectList}
                    getOptionLabel={(option) =>
                      `${option.code} - ${option.name}`
                    }
                    id="debug"
                    debug
                    onChange={this.handleChangeSubject}
                    renderInput={(params) => {
                      return <TextField {...params} label="Môn học" />;
                    }}
                  />
                  <Autocomplete
                    options={semesterList}
                    getOptionLabel={(option) =>
                      `${option.code} - ${option.semesterName}`
                    }
                    id="debug"
                    debug
                    onChange={this.handleChangeSemester}
                    style={{ marginTop: "16px" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Học kỳ" />
                    )}
                  />
                </Grid>
                <Grid item sm={2} xs={12} style={{ marginLeft: "2rem" }}>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={viLocale}
                  >
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
                      onChange={(date) =>
                        this.handleDateChange(date, "endDate")
                      }
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            ) : null}
            {option === "createSchedule" ? (
              <Fragment>
                <h5 className="mb-20">{`Thông tin lớp học phần: ${classObj.code} - ${classObj.name}`}</h5>
                <Grid className="mb-16" container>
                  <div className="day">
                    <span className="thu">Thứ 2</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          <Checkbox
                            name="monday"
                            value={value}
                            onChange={this.handleChangeCheckbox}
                            className="my-checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 3</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 10} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          <Checkbox
                            name="tuesday"
                            value={value}
                            onChange={this.handleChangeCheckbox}
                            className="my-checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 4</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 11} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          <Checkbox
                            name="wednesday"
                            value={value}
                            onChange={this.handleChangeCheckbox}
                            className="my-checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 5</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 12} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          <Checkbox
                            name="thursday"
                            value={value}
                            onChange={this.handleChangeCheckbox}
                            className="my-checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 6</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 13} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          <Checkbox
                            name="friday"
                            value={value}
                            onChange={this.handleChangeCheckbox}
                            className="my-checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 7</span>
                    {1 &&
                      checkboxArray.map((value) => {
                        return (
                          <div key={value * 14} className="wrap-checbox">
                            <span>{`Tiết ${value}`}</span>
                            <Checkbox
                              name="saturday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          </div>
                        );
                      })}
                  </div>
                  <div className="day">
                    <span className="thu">Chủ nhật</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 15} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          <Checkbox
                            name="sunday"
                            value={value}
                            onChange={this.handleChangeCheckbox}
                            className="my-checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                </Grid>
              </Fragment>
            ) : null}

            {option === "viewSchedule" ? (
              <Fragment>
                <h5 className="mb-20">{`Thông tin lớp học phần: ${classObj.code} - ${classObj.name}`}</h5>
                <Grid className="mb-16" container>
                  <div className="day">
                    <span className="thu">Thứ 2</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          {scheduleObj.monday &&
                          checkExistElementInArray(
                            scheduleObj.monday,
                            value
                          ) ? (
                            <Checkbox
                              defaultChecked
                              key={value * 20}
                              name="monday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          ) : (
                            <Checkbox
                              key={value * 21}
                              name="monday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 3</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 10} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          {scheduleObj.tuesday &&
                          checkExistElementInArray(
                            scheduleObj.tuesday,
                            value
                          ) ? (
                            <Checkbox
                              key={value * 30}
                              defaultChecked
                              name="tuesday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          ) : (
                            <Checkbox
                              key={value * 31}
                              name="tuesday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 4</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 11} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          {scheduleObj.wednesday &&
                          checkExistElementInArray(
                            scheduleObj.wednesday,
                            value
                          ) ? (
                            <Checkbox
                              defaultChecked
                              key={value * 40}
                              name="wednesday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          ) : (
                            <Checkbox
                              name="wednesday"
                              key={value * 41}
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 5</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 12} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          {scheduleObj.thursday &&
                          checkExistElementInArray(
                            scheduleObj.thursday,
                            value
                          ) ? (
                            <Checkbox
                              defaultChecked
                              key={value * 50}
                              name="thursday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          ) : (
                            <Checkbox
                              name="thursday"
                              key={value * 51}
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 6</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 13} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          {scheduleObj.friday &&
                          checkExistElementInArray(
                            scheduleObj.friday,
                            value
                          ) ? (
                            <Checkbox
                              defaultChecked
                              key={value * 60}
                              name="friday"
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          ) : (
                            <Checkbox
                              name="friday"
                              key={value * 61}
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="day">
                    <span className="thu">Thứ 7</span>
                    {1 &&
                      checkboxArray.map((value) => {
                        return (
                          <div key={value * 14} className="wrap-checbox">
                            <span>{`Tiết ${value}`}</span>
                            {scheduleObj.saturday &&
                            checkExistElementInArray(
                              scheduleObj.saturday,
                              value
                            ) ? (
                              <Checkbox
                                defaultChecked
                                key={value * 70}
                                name="saturday"
                                value={value}
                                onChange={this.handleChangeCheckbox}
                                className="my-checkbox"
                              />
                            ) : (
                              <Checkbox
                                name="saturday"
                                key={value * 71}
                                value={value}
                                onChange={this.handleChangeCheckbox}
                                className="my-checkbox"
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                  <div className="day">
                    <span className="thu">Chủ nhật</span>
                    {checkboxArray.map((value) => {
                      return (
                        <div key={value * 15} className="wrap-checbox">
                          <span>{`Tiết ${value}`}</span>
                          {scheduleObj.sunday &&
                          checkExistElementInArray(
                            scheduleObj.sunday,
                            value
                          ) ? (
                            <Checkbox
                              defaultChecked
                              name="sunday"
                              key={value * 80}
                              value={value}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          ) : (
                            <Checkbox
                              name="sunday"
                              value={value}
                              key={value * 81}
                              onChange={this.handleChangeCheckbox}
                              className="my-checkbox"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Grid>
              </Fragment>
            ) : null}
            {option === "addTeacher" || option === "updateTeacher" ? (
              <Fragment>
                <h5 className="mb-20">{`Thông tin lớp học phần: ${classObj.code} - ${classObj.name}`}</h5>
                {option === "updateTeacher" && (
                  <h5 className="mb-20">{`Giáo viên: ${classObj.teacher}`}</h5>
                )}
                <h6>Tìm kiếm giáo viên</h6>
                <TextField
                  className={classes.inputSearch}
                  margin="none"
                  name="keywordSearch"
                  value={keywordSearch}
                  variant="outlined"
                  placeholder="Nhập mã, tên giáo viên"
                  onChange={(event, list, listCache) =>
                    this.handleChangeSearch(
                      event,
                      "teacherList",
                      "teacherListCache"
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon fontSize="small">search</Icon>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: {
                      padding: "10px",
                    },
                  }}
                  fullWidth
                ></TextField>
                <FormControl component="fieldset"></FormControl>
                <FormLabel component="legend">Giáo viên</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={teacherCode}
                  onChange={(event, name) =>
                    this.handleChangeRatio(event, "teacherCode")
                  }
                >
                  {teacherList.map((value, index) => {
                    return (
                      <Fragment key={index}>
                        <FormControlLabel
                          value={value.code}
                          control={<Radio />}
                          label={`${value.code} - ${value.name}`}
                        />
                      </Fragment>
                    );
                  })}
                </RadioGroup>
                {teacherList.length === 0 && <p>Không có dữ liệu</p>}
              </Fragment>
            ) : null}
            <div className="my-btn-group" style={{ marginTop: "2rem" }}>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading || option === "viewSchedule"}
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
              <Button onClick={() => this.props.handleClose()}>Thoát</Button>
            </div>
          </ValidatorForm>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ClassDialog);

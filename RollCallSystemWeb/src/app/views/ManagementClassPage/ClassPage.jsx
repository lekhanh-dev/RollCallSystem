import React, { Component, Fragment } from "react";
import { Breadcrumb, ConfirmationDialog } from "matx";
import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  TablePagination,
  Button,
  Card,
  Tooltip,
  withStyles,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import { viVN } from "@material-ui/core/locale";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import ClassDialog from "./ClassDialog";
import { getClass, deleteClass } from "./ClassService";
import { formatDate } from "../../../utils";
import { NavLink } from "react-router-dom";

const theme = createMuiTheme({}, viVN);

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

  alertWrapper: {
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100%",
    zIndex: 999999,
  },

  alert: {
    color: "white !important",
  },

  inputSearch: {
    width: "auto",
    float: "right",
  },

  text: {
    wordWrap: "break-word",
  },
});

class ClassPage extends Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    classList: null,
    classListCache: [],
    shouldOpenClassDialog: false,
    shouldOpenConfirmationDialog: false,
    keywordSearch: "",
    option: "",
    class: null,
    openAlert: false,
    textAlert: "",
    typeAlert: "success",
    scheduleId: null,
  };

  componentDidMount() {
    setTimeout(() => {
      this.updateData();
    }, 300);
  }

  updateData = () => {
    getClass().then((res) => {
      this.setState({
        classList: [...res.data].reverse(),
        classListCache: [...res.data].reverse(),
      });
      this.handleChangeSearch(this.state.keywordSearch);
    });
  };

  setPage = (page) => {
    this.setState({ page });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDeleteClass = (data) => {
    this.setState({
      class: data.class,
      index: data.index,
      shouldOpenConfirmationDialog: true,
      option: data.option,
    });
  };

  handleDialogClose = (open, data) => {
    if (open === true) {
      this.setState({
        shouldOpenClassDialog: false,
        shouldOpenConfirmationDialog: false,
        openAlert: true,
        textAlert: data,
        typeAlert: "success",
        classList: null,
      });
      if (this.state.option === "addNew") {
        this.setState({ page: 0 });
      }
      if (this.state.option === "delete") {
        if (
          this.state.index === this.state.classListCache.length &&
          (this.state.index - 1) % this.state.rowsPerPage === 0
        ) {
          this.setState({ page: this.state.page - 1 });
        }
      }
      this.updateData();
    } else if (open === false && data.message) {
      this.setState({
        openAlert: true,
        textAlert: data.message,
        typeAlert: "error",
      });
    } else {
      this.setState({
        shouldOpenClassDialog: false,
        shouldOpenConfirmationDialog: false,
      });
    }
    setTimeout(() => {
      this.setState({ openAlert: false });
    }, 6000);
  };

  setOpenAlert = (param) => {
    this.setState({ openAlert: param });
  };

  handleConfirmationResponse = () => {
    deleteClass({ code: this.state.class.code })
      .then(() => {
        this.handleDialogClose(true);
        this.setState({ textAlert: "Xóa lớp học phần thành công" });
      })
      .catch((error) => {
        this.setState({ shouldOpenConfirmationDialog: false });
        if (!error.response) {
          alert("Máy chủ đang bận, mời bạn thử lại");
        }
      });
  };

  updateKeywordSearch = (event) => {
    return new Promise((resolve, reject) => {
      let value = typeof event === "string" ? event : event.target.value;
      value = value.replace(/\*|\(|\)|\+|\[|\]|\?|\\/g, "");
      this.setState({
        keywordSearch: value,
      });
      resolve(1);
    });
  };

  handleChangeSearch = (event) => {
    let listClass = [];
    this.updateKeywordSearch(event)
      .then(() => {
        let keyword = this.state.keywordSearch.toLowerCase();
        listClass = this.state.classListCache.slice().filter((value, index) => {
          let code = value.code.toLowerCase();
          let name = value.name.toLowerCase();
          return code.search(keyword) !== -1 || name.search(keyword) !== -1;
        });
        return listClass;
      })
      .then((data) => {
        this.setState({ classList: [...data] });
      });
  };

  handleChangeOption = (option) => {
    this.setState({ option: option });
  };

  render() {
    let {
      rowsPerPage,
      page,
      classList,
      shouldOpenConfirmationDialog,
      shouldOpenClassDialog,
      openAlert,
      textAlert,
      typeAlert,
      // option,
      keywordSearch,
    } = this.state;

    let { classes } = this.props;
    let skeleton = Array(rowsPerPage)
      .fill(1)
      .map((value, index) => {
        return (
          <TableRow key={index}>
            <TableCell className="pr-16">
              <Skeleton animation="wave" height={40} />
            </TableCell>
          </TableRow>
        );
      });

    let displayNotFound =
      classList && classList.length === 0 ? (
        <TableRow>
          <TableCell>Không có dữ liệu</TableCell>
        </TableRow>
      ) : null;

    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: "Quản lý lớp học phần" }]} />
        </div>

        <Button
          className="mb-16"
          variant="contained"
          color="primary"
          onClick={() =>
            this.setState({
              shouldOpenClassDialog: true,
              option: "addNew",
            })
          }
        >
          Thêm lớp học phần mới
        </Button>
        <TextField
          className={classes.inputSearch}
          margin="none"
          name="keywordSearch"
          value={keywordSearch}
          variant="outlined"
          placeholder="Nhập mã, tên lớp học phần"
          onClick={() => {
            this.handleChangeOption("search");
          }}
          onChange={this.handleChangeSearch}
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
        <Card className="w-100 overflow-auto" elevation={6}>
          {classList && (
            <Fragment>
              <Table
                className="crud-table"
                style={{ whiteSpace: "pre", minWidth: "1300px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "50px" }}>STT</TableCell>
                    <TableCell>Mã lớp học</TableCell>
                    <TableCell>Tên lớp học</TableCell>
                    <TableCell>Môn học</TableCell>
                    <TableCell>Thời gian</TableCell>
                    <TableCell style={{ width: "100px" }}>Lịch trình</TableCell>
                    <TableCell style={{ width: "200px" }}>Giáo viên</TableCell>
                    <TableCell>Số sinh viên</TableCell>
                    <TableCell>Tùy chọn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayNotFound}
                  {classList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((classObj, index) => {
                      return (
                        <TableRow key={index + 1 + rowsPerPage * page}>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                            style={{ width: "50px" }}
                          >
                            <Tooltip title={index + 1} placement="top" arrow>
                              <span className={classes.text}>
                                {index + 1 + rowsPerPage * page}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={classObj.code}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {classObj.code}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={classObj.name}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {classObj.name}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={classObj.subject}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {classObj.subject}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={`Từ ${formatDate(
                                classObj.startDate
                              )} đến ${formatDate(classObj.endDate)}`}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {`Từ ${formatDate(classObj.startDate)}`}{" "}
                                <br></br>
                                {`đến ${formatDate(classObj.endDate)}`}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                            style={{ width: "100px" }}
                          >
                            {classObj.schedule ? (
                              <IconButton
                                onClick={() =>
                                  this.setState({
                                    shouldOpenClassDialog: true,
                                    scheduleId: classObj.schedule,
                                    class: classObj,
                                    option: "viewSchedule",
                                  })
                                }
                              >
                                <Tooltip
                                  title="Xem chi tiết"
                                  placement="top"
                                  arrow
                                >
                                  <Icon color="primary">visibility</Icon>
                                </Tooltip>
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  this.setState({
                                    shouldOpenClassDialog: true,
                                    class: classObj,
                                    option: "createSchedule",
                                  })
                                }
                              >
                                <Tooltip
                                  title="Tạo lịch trình"
                                  placement="top"
                                  arrow
                                >
                                  <Icon color="primary">add</Icon>
                                </Tooltip>
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                            style={{ width: "200px" }}
                          >
                            {classObj.schedule && classObj.teacher ? (
                              <Fragment>
                                <IconButton
                                  onClick={() =>
                                    this.setState({
                                      shouldOpenClassDialog: true,
                                      class: classObj,
                                      option: "updateTeacher",
                                    })
                                  }
                                >
                                  <Tooltip
                                    title="Thay đổi"
                                    placement="top"
                                    arrow
                                  >
                                    <Icon color="primary">edit</Icon>
                                  </Tooltip>
                                </IconButton>
                                <Tooltip
                                  title={classObj.teacher}
                                  placement="top"
                                  arrow
                                >
                                  <span className={classes.text}>
                                    {classObj.teacher}
                                  </span>
                                </Tooltip>
                              </Fragment>
                            ) : null}
                            {classObj.schedule && !classObj.teacher ? (
                              <IconButton
                                onClick={() =>
                                  this.setState({
                                    shouldOpenClassDialog: true,
                                    class: classObj,
                                    option: "addTeacher",
                                  })
                                }
                              >
                                <Tooltip
                                  title="Thêm giáo viên"
                                  placement="top"
                                  arrow
                                >
                                  <Icon color="primary">add</Icon>
                                </Tooltip>
                              </IconButton>
                            ) : null}
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            {classObj.schedule && classObj.sumStudent ? (
                              <Tooltip
                                title="Xem chi tiết"
                                placement="top"
                                arrow
                              >
                                <NavLink
                                  to={`/management/add-student-to-class/${classObj.code}`}
                                  className="nav-item"
                                >
                                  <span className={classes.text}>
                                    {`${classObj.sumStudent} học sinh`}
                                  </span>
                                </NavLink>
                              </Tooltip>
                            ) : null}
                            {classObj.schedule && !classObj.sumStudent ? (
                              <IconButton
                              // onClick={() =>
                              //   this.setState({
                              //     shouldOpenClassDialog: true,
                              //     class: classObj,
                              //     option: "addStudent",
                              //   })
                              // }
                              >
                                <Tooltip
                                  title="Thêm sinh viên"
                                  placement="top"
                                  arrow
                                >
                                  <NavLink
                                    to={`/management/add-student-to-class/${classObj.code}`}
                                    className="nav-item"
                                  >
                                    <Icon color="primary">add</Icon>
                                  </NavLink>
                                </Tooltip>
                              </IconButton>
                            ) : null}
                          </TableCell>
                          <TableCell className="px-0 pr-16 border-none">
                            <IconButton
                              onClick={() =>
                                this.setState({
                                  shouldOpenClassDialog: true,
                                  class: classObj,
                                  option: "update",
                                })
                              }
                            >
                              <Tooltip title="Chỉnh sửa" placement="top" arrow>
                                <Icon color="primary">edit</Icon>
                              </Tooltip>
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                this.handleDeleteClass({
                                  class: classObj,
                                  index: index + 1 + rowsPerPage * page,
                                  option: "delete",
                                })
                              }
                            >
                              <Tooltip title="Xóa" placement="top" arrow>
                                <Icon color="error">delete</Icon>
                              </Tooltip>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <ThemeProvider theme={theme}>
                <TablePagination
                  className="px-16"
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={classList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.setRowsPerPage}
                />
              </ThemeProvider>
              {shouldOpenClassDialog && (
                <ClassDialog
                  handleClose={(open, data) => {
                    this.handleDialogClose(open, data);
                  }}
                  open={shouldOpenClassDialog}
                  option={this.state.option}
                  classObj={this.state.class}
                  scheduleId={this.state.scheduleId}
                />
              )}
              {shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  open={shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  loadingCircularProgress={false}
                  text={`Bạn có chắc chắn muốn xóa lớp học phần: ${
                    this.state.class && this.state.class.name
                  }`}
                />
              )}
            </Fragment>
          )}
          {!classList && (
            <Table
              className="crud-table"
              style={{ whiteSpace: "pre", minWidth: "750px" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell className="pr-16">
                    <Skeleton animation="wave" height={40} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{skeleton}</TableBody>
            </Table>
          )}
        </Card>

        <Collapse in={openAlert} className={classes.alertWrapper}>
          <Alert
            className={classes.alert}
            variant="filled"
            severity={typeAlert}
            action={
              <IconButton
                color="inherit"
                aria-label="close"
                size="small"
                onClick={() => {
                  this.setOpenAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {textAlert}
          </Alert>
        </Collapse>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ClassPage);

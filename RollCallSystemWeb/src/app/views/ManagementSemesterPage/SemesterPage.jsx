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
import SemesterDialog from "./SemesterDialog";
import { getSemesters, deleteSemester } from "./SemesterService";
import { formatDate } from "../../../utils";

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

class SemesterPage extends Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    semesterList: null,
    semesterListCache: [],
    shouldOpenSemesterDialog: false,
    shouldOpenConfirmationDialog: false,
    keywordSearch: "",
    option: "",
    semester: null,
    openAlert: false,
    textAlert: "",
    typeAlert: "success",
  };

  componentDidMount() {
    setTimeout(() => {
      this.updateData();
    }, 300);
  }

  updateData = () => {
    getSemesters().then((res) => {
      this.setState({
        semesterList: [...res.data].reverse(),
        semesterListCache: [...res.data].reverse(),
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

  handleDeleteSemester = (data) => {
    this.setState({
      semester: data.semester,
      index: data.index,
      shouldOpenConfirmationDialog: true,
      option: data.option,
    });
  };

  handleDialogClose = (open, data) => {
    if (open === true) {
      this.setState({
        shouldOpenSemesterDialog: false,
        shouldOpenConfirmationDialog: false,
        openAlert: true,
        textAlert: data,
        typeAlert: "success",
        semesterList: null,
      });
      if (this.state.option === "addNew") {
        this.setState({ page: 0 });
      }
      if (this.state.option === "delete") {
        if (
          this.state.index === this.state.semesterListCache.length &&
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
        shouldOpenSemesterDialog: false,
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
    deleteSemester(this.state.semester)
      .then(() => {
        this.handleDialogClose(true);
        this.setState({ textAlert: "Xóa kỳ thành công" });
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
    let semesterList = [];
    this.updateKeywordSearch(event)
      .then(() => {
        let keyword = this.state.keywordSearch.toLowerCase();
        semesterList = this.state.semesterListCache
          .slice()
          .filter((value, index) => {
            let code = value.code.toLowerCase();
            let name = value.semesterName.toLowerCase();
            return code.search(keyword) !== -1 || name.search(keyword) !== -1;
          });
        return semesterList;
      })
      .then((data) => {
        this.setState({ semesterList: [...data] });
      });
  };

  handleChangeOption = (option) => {
    this.setState({ option: option });
  };

  render() {
    let {
      rowsPerPage,
      page,
      semesterList,
      shouldOpenConfirmationDialog,
      shouldOpenSemesterDialog,
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
      semesterList && semesterList.length === 0 ? (
        <TableRow>
          <TableCell>Không có dữ liệu</TableCell>
        </TableRow>
      ) : null;

    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: "Quản lý học kỳ" }]} />
        </div>

        <Button
          className="mb-16"
          variant="contained"
          color="primary"
          onClick={() =>
            this.setState({
              shouldOpenSemesterDialog: true,
              option: "addNew",
            })
          }
        >
          Thêm học kỳ mới
        </Button>
        <TextField
          className={classes.inputSearch}
          margin="none"
          name="keywordSearch"
          value={keywordSearch}
          variant="outlined"
          placeholder="Nhập mã, tên học kỳ"
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
          {semesterList && (
            <Fragment>
              <Table
                className="crud-table"
                style={{ whiteSpace: "pre", minWidth: "750px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "50px" }}>STT</TableCell>
                    <TableCell>Mã học kỳ</TableCell>
                    <TableCell>Tên học kỳ</TableCell>
                    <TableCell>Ngày bắt dầu</TableCell>
                    <TableCell>Ngày kết thúc</TableCell>
                    <TableCell>Tùy chọn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayNotFound}
                  {semesterList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((semester, index) => {
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
                              title={semester.code}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {semester.code}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={semester.semesterName}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {semester.semesterName}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={formatDate(semester.startDate)}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {formatDate(semester.startDate)}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            className="px-0 pr-16 cell"
                            align="justify"
                          >
                            <Tooltip
                              title={formatDate(semester.endDate)}
                              placement="top"
                              arrow
                            >
                              <span className={classes.text}>
                                {formatDate(semester.endDate)}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="px-0 pr-16 border-none">
                            <IconButton
                              onClick={() =>
                                this.setState({
                                  shouldOpenSemesterDialog: true,
                                  semester,
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
                                this.handleDeleteSemester({
                                  semester: semester,
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
                  count={semesterList.length}
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
              {shouldOpenSemesterDialog && (
                <SemesterDialog
                  handleClose={(open, data) => {
                    this.handleDialogClose(open, data);
                  }}
                  open={shouldOpenSemesterDialog}
                  option={this.state.option}
                  semester={this.state.semester}
                />
              )}
              {shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  open={shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  loadingCircularProgress={false}
                  text={`Bạn có chắc chắn muốn xóa học kỳ: ${
                    this.state.semester && this.state.semester.semesterName
                  }`}
                />
              )}
            </Fragment>
          )}
          {!semesterList && (
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

export default withStyles(styles, { withTheme: true })(SemesterPage);

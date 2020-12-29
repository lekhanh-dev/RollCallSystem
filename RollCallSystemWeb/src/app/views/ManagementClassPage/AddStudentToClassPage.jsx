import React, { Component, Fragment } from "react";
import {
  Dialog,
  Card,
  Button,
  Grid,
  Tooltip,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  getStudentByClass,
  getStudentInClass,
  getClassByCode,
  addStudentToClass,
} from "./ClassService";

class AddStudentToClassPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classCode: this.getClassCode(this.props.location.pathname),
      className: null,
      listStudentInClass: [],
      listStudentSatisfy: [],
      studentCodeList: [],
      change: true,
    };

    this.loadData();
  }

  loadData = () => {
    getClassByCode(this.state.classCode)
      .then((res) => {
        this.setState({
          className: res.data.name,
        });
      })
      .catch((err) => {
        console.log("Class not exist");
      });

    getStudentInClass(this.state.classCode)
      .then((res) => {
        this.setState({
          listStudentInClass: res.data,
        });
      })
      .catch((err) => {
        console.log("Not exist");
      });

    getStudentByClass(this.state.classCode)
      .then((res) => {
        this.setState({
          listStudentSatisfy: res.data,
        });
      })
      .catch((err) => {
        console.log("Not exist");
      });
  };

  getClassCode = (str) => {
    let array = str.split("/");
    return array[array.length - 1];
  };

  handleChangeCheckboxForDelete = () => {};

  handleChangeCheckboxForAdd = (event) => {
    let checked = event.target.checked;
    let studentCode = event.target.value;
    let studentCodeList = this.state.studentCodeList.slice();
    if (checked) {
      studentCodeList.push(studentCode);
    } else {
      let filtered = studentCodeList.slice().filter(function (value) {
        return value !== studentCode;
      });
      studentCodeList = filtered.slice();
    }
    this.setState({ studentCodeList: [...studentCodeList] });
  };

  handleAddStudentToClass = () => {
    if (this.state.studentCodeList.length > 0) {
      addStudentToClass(this.state.classCode, this.state.studentCodeList)
        .then(() => {
          alert("Add student successful");
          this.setState({ studentCodeList: [], change: !this.state.change });
          this.loadData();
        })
        .catch((err) => {
          alert("Not add, please try again");
        });
    } else {
      alert("No student selected");
    }
  };

  render() {
    let {
      classCode,
      className,
      listStudentInClass,
      listStudentSatisfy,
      // studentCodeList,
      change,
    } = this.state;
    return (
      <Fragment>
        <Dialog open={true} fullScreen>
          <div className="my-dialog">
            <div className="m-sm-30">
              <div className="mb-sm-30"></div>
              <Card elevation={2} className="pt-20 mb-24">
                <h5 className="mb-20 my-header">{`Thông tin sinh viên lớp học phần: ${classCode} - ${className}`}</h5>
              </Card>
              <div className="py-1" />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card elevation={2} className="pt-20 mb-24 student-in-class">
                    <h5 className="mb-20 my-header">Sinh viên đang tham gia</h5>
                    <Table
                      className="crud-table"
                      style={{ whiteSpace: "pre", minWidth: "300px" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "50px" }}>
                            <Checkbox
                              name="all"
                              value="all"
                              onChange={this.handleChangeCheckboxForDelete}
                              className="my-checkbox-type-2"
                            />
                          </TableCell>
                          <TableCell>Mã sinh viên</TableCell>
                          <TableCell>Tên sinh viên</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listStudentInClass.map((value, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell style={{ width: "50px" }}>
                                <Checkbox
                                  name="all"
                                  // defaultChecked
                                  value={value.code}
                                  onChange={this.handleChangeCheckboxForDelete}
                                  className="my-checkbox-type-2"
                                />
                              </TableCell>
                              <TableCell
                                className="px-0 pr-16 cell"
                                align="justify"
                              >
                                <Tooltip
                                  title={value.code}
                                  placement="top"
                                  arrow
                                >
                                  <span className="my-text-type-2">
                                    {value.code}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                className="px-0 pr-16 cell"
                                align="justify"
                              >
                                <Tooltip
                                  title={value.name}
                                  placement="top"
                                  arrow
                                >
                                  <span className="my-text-type-2">
                                    {value.name}
                                  </span>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <div className="wrap-action">
                      <Button
                        className="mb-16 wrap-action-btn"
                        variant="contained"
                        color="primary"
                      >
                        Xóa học sinh đã chọn
                      </Button>
                    </div>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card elevation={2} className="pt-20 mb-24 student-in-class">
                    <h5 className="mb-20 my-header">
                      Sinh viên đủ điều kiện tham gia
                    </h5>
                    <Table
                      className="crud-table"
                      style={{ whiteSpace: "pre", minWidth: "300px" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "50px" }}>
                            <Checkbox
                              name="all"
                              // value="all"
                              onChange={this.handleChangeCheckboxForAdd}
                              className="my-checkbox-type-2"
                            />
                          </TableCell>
                          <TableCell>Mã sinh viên</TableCell>
                          <TableCell>Tên sinh viên</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {change &&
                          listStudentSatisfy.map((value, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell style={{ width: "50px" }}>
                                  <Checkbox
                                    name="all"
                                    value={value.code}
                                    onChange={this.handleChangeCheckboxForAdd}
                                    className="my-checkbox-type-2"
                                  />
                                </TableCell>
                                <TableCell
                                  className="px-0 pr-16 cell"
                                  align="justify"
                                >
                                  <Tooltip
                                    title={value.code}
                                    placement="top"
                                    arrow
                                  >
                                    <span className="my-text-type-2">
                                      {value.code}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  className="px-0 pr-16 cell"
                                  align="justify"
                                >
                                  <Tooltip
                                    title={value.name}
                                    placement="top"
                                    arrow
                                  >
                                    <span className="my-text-type-2">
                                      {value.name}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}

                        {!change &&
                          listStudentSatisfy.map((value, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell style={{ width: "50px" }}>
                                  <Checkbox
                                    name="all"
                                    value={value.code}
                                    onChange={this.handleChangeCheckboxForAdd}
                                    className="my-checkbox-type-2"
                                  />
                                </TableCell>
                                <TableCell
                                  className="px-0 pr-16 cell"
                                  align="justify"
                                >
                                  <Tooltip
                                    title={value.code}
                                    placement="top"
                                    arrow
                                  >
                                    <span className="my-text-type-2">
                                      {value.code}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  className="px-0 pr-16 cell"
                                  align="justify"
                                >
                                  <Tooltip
                                    title={value.name}
                                    placement="top"
                                    arrow
                                  >
                                    <span className="my-text-type-2">
                                      {value.name}
                                    </span>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    <div className="wrap-action">
                      <Button
                        className="mb-16 wrap-action-btn"
                        variant="contained"
                        color="primary"
                        onClick={this.handleAddStudentToClass}
                      >
                        Thêm học sinh đã chọn
                      </Button>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default AddStudentToClassPage;

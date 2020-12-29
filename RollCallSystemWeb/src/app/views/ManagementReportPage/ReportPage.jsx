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
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  getAllClass,
  getDetailStudentInClass,
  exportFileExcel,
} from "./ReportService";
import { formatDate } from "../../../utils";

const theme = createMuiTheme();

const FileDownload = require("js-file-download");

const styles = (theme) => ({});

class ReportPage extends Component {
  state = {
    classList: [],
    studentList: [],
    classCode: "",
    className: "",
  };

  componentDidMount() {
    setTimeout(() => {
      this.updateData();
    }, 300);
  }

  updateData = () => {
    getAllClass().then((res) => {
      // console.log(...res.data);
      this.setState({ classList: [...res.data] });
    });
  };

  handleChange = (event, newValue) => {
    if (newValue) {
      this.setState({ classCode: newValue.code, className: newValue.name });
      getDetailStudentInClass(newValue.code).then((res) => {
        this.setState({ studentList: [...res.data] });
      });
    }
  };

  handleExportExcel = () => {
    exportFileExcel(this.state.classCode).then((response) => {
      FileDownload(response.data, this.state.className + ".xlsx");
    });
  };

  render() {
    let { classList, studentList } = this.state;

    let { classes } = this.props;

    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: "Báo cáo thống kê" }]} />
        </div>
        <Autocomplete
          id="combo-box-demo"
          options={classList}
          getOptionLabel={(option) => option.code + " - " + option.name}
          style={{ width: 300, marginBottom: 10 }}
          onChange={this.handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Chọn lớp học phần"
              variant="outlined"
            />
          )}
        />
        <Button
          className="mb-16"
          variant="contained"
          color="primary"
          onClick={this.handleExportExcel}
        >
          Xuất Excel
        </Button>
        <Card className="w-100 overflow-auto" elevation={6}>
          {studentList.length !== 0 && (
            <Table
              className="crud-table"
              style={{ whiteSpace: "pre", minWidth: "auto" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "50px" }}>STT</TableCell>
                  <TableCell style={{ width: "150px" }}>Mã sinh viên</TableCell>
                  <TableCell style={{ width: "150px" }}>
                    Tên sinh viên
                  </TableCell>
                  {studentList[0].history.map((value, index) => {
                    return (
                      <TableCell key={index} style={{ width: "150px" }}>
                        {formatDate(value.date)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList.map((value, index) => {
                  return (
                    <TableRow key={index * 1000}>
                      <TableCell style={{ width: "50px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ width: "150px" }}>
                        {value.code}
                      </TableCell>
                      <TableCell style={{ width: "150px" }}>
                        {value.name}
                      </TableCell>
                      {studentList[index].history.map((v, i) => {
                        return (
                          <TableCell key={i * 9999} style={{ width: "150px" }}>
                            {v.status}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ReportPage);

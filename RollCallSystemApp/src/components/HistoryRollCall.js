import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import {
  getRollCallDateList,
  getDetailStudentInRollCall,
  updateStatusStudentInRollCall,
} from "../services/userService";
import { formatDate } from "../util";

class HistoryRollCall extends React.Component {
  state = {
    rollCallList: null,
    dateSelected: "",
    open: false,
    studentList: null,
    statusArray: [],
  };

  componentDidMount() {
    getRollCallDateList(this.props.classObj.code).then((res) => {
      this.setState({ rollCallList: [...res.data].reverse() });
    });
  }

  handleClickDate = (date) => {
    this.setState({ open: true, dateSelected: date });
    getDetailStudentInRollCall(this.props.classObj.code, date).then((res) => {
      this.setState({ studentList: [...res.data] }, () => {
        let statusList = [];
        this.state.studentList.map((value) => {
          if (value.status === null) statusList.push(false);
          if (value.status === 0) statusList.push(false);
          if (value.status === 1) statusList.push(true);
        });
        this.setState({ statusArray: [...statusList] });
      });
    });
  };

  handleClickCheckBox = (index) => {
    let statusList = [...this.state.statusArray];
    statusList[index] = !statusList[index];
    this.setState({ statusArray: [...statusList] });
  };

  handleUpdateStatus = () => {
    let studentList = [...this.state.studentList];
    let statusList = [...this.state.statusArray];

    statusList.map((value, index) => {
      if (value === true) {
        studentList[index].status = 1;
      }
      if (value === false) {
        studentList[index].status = 0;
      }
    });

    updateStatusStudentInRollCall(
      this.props.classObj.code,
      this.state.dateSelected,
      studentList
    ).then(() => {
      alert("Cập nhập thành công");
      this.setState({ open: false });
      getRollCallDateList(this.props.classObj.code).then((res) => {
        this.setState({ rollCallList: [...res.data].reverse() });
      });
    });
  };

  render() {
    let {
      rollCallList,
      open,
      dateSelected,
      studentList,
      statusArray,
    } = this.state;
    // console.log(statusArray);
    return (
      <View>
        <Text style={styles.header}>Nhật ký</Text>
        <View>
          <View style={styles.wrapHead}>
            <View style={styles.col}>
              <Text style={styles.textHead}>Ngày</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.textHead}>Tỷ lệ</Text>
            </View>
          </View>
          <ScrollView>
            {rollCallList &&
              rollCallList.map((value, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.row}
                    onPress={() => this.handleClickDate(value.date)}
                  >
                    <View style={styles.col}>
                      <Text style={styles.textDate}>
                        {formatDate(value.date)}
                      </Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={styles.textRate}>{value.rate}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={open}
          onRequestClose={() => {
            this.setState({ open: false, statusArray: [] });
          }}
        >
          <View style={styles.container}>
            <Text
              style={[
                styles.headerDate,
                { color: "white", backgroundColor: "#4b4bff" },
              ]}
            >
              {formatDate(dateSelected)}
            </Text>
            <ScrollView>
              {studentList &&
                studentList.map((value, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.row}
                      onPress={() => this.handleClickCheckBox(index)}
                    >
                      <View style={styles.colStudent}>
                        <Text style={styles.textStudent}>
                          {value.code} - {value.name}
                        </Text>
                      </View>
                      <View style={styles.colCheckBox}>
                        {/* <Text style={styles.textRate}>{value.status}</Text> */}
                        <CheckBox
                          value={statusArray[index]}
                          onChange={() => this.handleClickCheckBox(index)}
                          tintColors={{ true: "#4b4bff" }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <View style={styles.wrap_btn}>
              <View style={styles.btn}>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={this.handleUpdateStatus}
                >
                  <Text style={styles.btnText}>Cập nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: "700",
    margin: 5,
    marginLeft: 15,
  },
  headerDate: {
    fontSize: 20,
    fontWeight: "700",
    padding: 15,
  },
  wrapHead: {
    flexDirection: "row",
    // marginBottom: 10,
  },
  col: {
    width: "50%",
  },
  colStudent: {
    width: "90%",
    justifyContent: "center",
  },
  colCheckBox: {
    width: "10%",
  },
  textHead: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    margin: 2,
    paddingTop: 20,
    paddingBottom: 20,
  },
  textDate: {
    fontSize: 15,
    textAlign: "center",
  },
  textRate: {
    textAlign: "center",
    fontSize: 15,
  },
  textStudent: {
    marginLeft: 20,
  },
  container: {
    position: "relative",
    height: ScreenHeight,
    width: ScreenWidth,
  },
  wrap_btn: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  btn: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  updateBtn: {
    width: "80%",
    backgroundColor: "tomato",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  btnText: {
    color: "white",
  },
});

export default HistoryRollCall;
{
  /* <CheckBox
            value={true}
            // onValueChange={(newValue) => alert(newValue)}
            onChange={(newValue) => alert(newValue)}
            tintColors={{ true: "#4b4bff" }}
          /> */
}

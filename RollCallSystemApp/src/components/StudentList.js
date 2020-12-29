import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { getStudentInClass } from "../services/userService";

class StudentList extends React.Component {
  state = {
    studentList: null,
  };
  componentDidMount() {
    getStudentInClass(this.props.classObj.code).then((res) => {
      this.setState({ studentList: [...res.data] });
    });
  }
  render() {
    // console.log(this.props);
    let { studentList } = this.state;
    return (
      <View>
        <Text style={styles.header}>Danh sách sinh viên</Text>
        <View>
          <View style={styles.wrapHead}>
            <View style={styles.col}>
              <Text style={styles.textHead}>Mã SV</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.textHead}>Tên SV</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.textHead}>Tỷ lệ vắng</Text>
            </View>
          </View>
          <ScrollView>
            {studentList &&
              studentList.map((value, index) => {
                return (
                  <View key={index} style={styles.row}>
                    <View style={styles.col}>
                      <Text style={styles.textCode}>{value.code}</Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={styles.textName}>{value.name}</Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={styles.textRate}>{value.rate}</Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: "700",
    margin: 5,
    marginLeft: 15,
  },
  wrapHead: {
    flexDirection: "row",
    marginBottom: 10,
  },
  col: {
    width: "33.33333%",
  },
  textHead: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
  },
  textCode: {
    marginLeft: 30,
    fontSize: 15,
  },
  textName: {
    marginLeft: 25,
    fontSize: 15,
  },
  textRate: {
    marginLeft: 60,
    fontSize: 15,
  },
});

export default StudentList;

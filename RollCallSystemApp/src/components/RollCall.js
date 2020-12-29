import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { formatDate, formatSchedule } from "../util";

class RollCall extends React.Component {
  state = {};
  openCamera = () => {
    this.props.navigation.navigate("Camera", { classObj: this.props.classObj });
  };
  render() {
    // console.log(this.props);
    let { classObj } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Thông tin chi tiết</Text>
        <View style={styles.row}>
          <Text style={styles.left}>Mã lớp học:</Text>
          <Text style={styles.right}>{classObj.code}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Tên lớp học:</Text>
          <Text style={styles.right}>{classObj.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Môn học:</Text>
          <Text style={styles.right}>{classObj.subject}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Thời gian:</Text>
          <View style={styles.right}>
            <Text style={styles.text}>Từ {formatDate(classObj.startDate)}</Text>
            <Text style={styles.text}>đến {formatDate(classObj.endDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Lịch học trong tuần:</Text>
          <View style={styles.right}>
            {classObj.time.slice().map((value, index) => {
              return (
                <Text key={index} style={styles.text}>
                  {formatSchedule(value)}
                </Text>
              );
            })}
          </View>
        </View>
        {classObj.isActive && (
          <View style={styles.containerCamera}>
            <TouchableOpacity style={styles.camera} onPress={this.openCamera}>
              <Text style={styles.cameraText}>Điểm danh</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    // marginTop: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: "700",
    margin: 5,
    marginLeft: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 15,
  },
  left: {
    fontWeight: "600",
    width: "50%",
    fontSize: 18,
  },
  right: {
    fontWeight: "600",
    width: "50%",
    fontSize: 18,
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
  },
  containerCamera: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: -400,
  },
  camera: {
    width: "80%",
    backgroundColor: "tomato",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  cameraText: {
    color: "white",
  },
});

export default RollCall;

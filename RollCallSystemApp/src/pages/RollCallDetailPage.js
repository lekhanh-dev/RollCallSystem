import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { HistoryRollCall, RollCall, StudentList } from "../components";
import Icon from "react-native-vector-icons/FontAwesome";

class RollCallDetailPage extends React.Component {
  state = {
    option: "RollCall",
  };

  componentDidMount() {
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: false,
    });
    this.props.navigation.setOptions({ title: this.props.route.params.name });
  }

  componentWillUnmount() {
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: true,
    });
  }

  handleChangOption = (option) => {
    this.setState({ option: option });
  };

  render() {
    let { option } = this.state;
    // console.log(this.props);
    return (
      <View style={styles.container}>
        <View>
          {option === "RollCall" && (
            <RollCall
              classObj={this.props.route.params}
              navigation={this.props.navigation}
            ></RollCall>
          )}
          {option === "StudentList" && (
            <StudentList
              classObj={this.props.route.params}
              navigation={this.props.navigation}
            ></StudentList>
          )}
          {option === "History" && (
            <HistoryRollCall
              classObj={this.props.route.params}
              navigation={this.props.navigation}
            ></HistoryRollCall>
          )}
        </View>
        <View style={styles.nav_container}>
          <TouchableOpacity
            style={styles.nav_element}
            onPress={(parameter) => this.handleChangOption("RollCall")}
          >
            <Icon
              name="info-circle"
              size={20}
              color={option === "RollCall" ? "#4b4bff" : "gray"}
            />
            <Text
              style={[
                styles.nav_element_text,
                option === "RollCall" ? { color: "#4b4bff" } : null,
              ]}
            >
              Thông tin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nav_element}
            onPress={(parameter) => this.handleChangOption("StudentList")}
          >
            <Icon
              name="group"
              size={20}
              color={option === "StudentList" ? "#4b4bff" : "gray"}
            />
            <Text
              style={[
                styles.nav_element_text,
                option === "StudentList" ? { color: "#4b4bff" } : null,
              ]}
            >
              Sinh viên
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nav_element}
            onPress={(parameter) => this.handleChangOption("History")}
          >
            <Icon
              name="history"
              size={20}
              color={option === "History" ? "#4b4bff" : "gray"}
            />
            <Text
              style={[
                styles.nav_element_text,
                option === "History" ? { color: "#4b4bff" } : null,
              ]}
            >
              Nhật ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: ScreenHeight,
    width: ScreenWidth,
  },
  nav_container: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  nav_element: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    width: "33.333333%",
  },
  nav_element_text: {
    fontSize: 10,
    color: "gray",
  },
});

export default RollCallDetailPage;

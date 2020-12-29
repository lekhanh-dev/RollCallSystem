import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Card } from "react-native-elements";
import { getClassByTeacher } from "../services/userService";
import { connect } from "react-redux";
import { formatDate } from "../util";

class RollCallListPage extends React.Component {
  state = {
    classList: null,
    refreshing: false,
  };

  componentDidMount() {
    // setTimeout(() => {
    getClassByTeacher(this.props.user.displayName)
      .then((res) => {
        this.setState({ classList: [...res.data].reverse() });
      })
      .catch(() => {
        this.setState({ classList: [] });
      });
    // }, 500);
  }

  handleClick = (classObj) => {
    this.props.navigation.navigate("RollCallDetailPage", classObj);
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    getClassByTeacher(this.props.user.displayName)
      .then((res) => {
        this.setState({
          classList: [...res.data].reverse(),
          refreshing: false,
        });
      })
      .catch(() => {
        this.setState({ classList: [] });
      });
  };

  render() {
    let { classList, refreshing } = this.state;
    // console.log(classList);
    return (
      <React.Fragment>
        {!classList && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {classList && classList.length === 0 ? (
          <View style={styles.container}>
            <Text>Không tìm thấy lớp học nào</Text>
          </View>
        ) : null}
        {classList && classList.length !== 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <View style={styles.container_2}>
              {classList.slice().map((classObj, index) => {
                return (
                  <Card key={index} containerStyle={stylesElement.card}>
                    <TouchableOpacity
                      onPress={(parameter) => this.handleClick(classObj)}
                    >
                      <Text style={styles.className}>{classObj.name}</Text>
                      <Text style={styles.subjectName}>{classObj.subject}</Text>
                      {classObj.isActive && (
                        <View style={styles.statusActive}>
                          <Text style={styles.textActive}>Đang diễn ra</Text>
                        </View>
                      )}
                      <View style={styles.scheduleContainer}>
                        <View style={styles.left}>
                          {classObj.time.slice().map((value, index) => {
                            return <Text key={index * 11}>{value}</Text>;
                          })}
                        </View>
                        <View style={styles.right}>
                          <Text
                            style={{ textAlign: "right" }}
                          >{`Từ ${formatDate(classObj.startDate)}`}</Text>
                          <Text
                            style={{ textAlign: "right" }}
                          >{`đến ${formatDate(classObj.endDate)}`}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                );
              })}
            </View>
          </ScrollView>
        ) : null}
      </React.Fragment>
    );
  }
}

const stylesElement = {
  card: {
    borderRadius: 10,
    position: "relative",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  container_2: {
    // flexWrap: "wrap",
  },
  className: {
    fontSize: 18,
    fontWeight: "600",
    // color: "#fff",
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "500",
    // color: "#fff",
  },
  statusActive: {
    position: "absolute",
    backgroundColor: "tomato",
    padding: 5,
    right: -15,
    top: -15,
    borderTopRightRadius: 10,
  },
  textActive: {
    color: "white",
  },
  scheduleContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
  },
  left: {
    width: "50%",
  },
  right: {
    width: "50%",
    justifyContent: "flex-end",
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(RollCallListPage);

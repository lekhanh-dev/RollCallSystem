import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { getTeacherByUsername } from "../services/userService";
import { logoutUser } from "../redux/actions/UserActions";

class ProfilePage extends React.Component {
  state = {
    code: "",
    name: "",
  };

  componentDidMount() {
    getTeacherByUsername(this.props.user.displayName).then((res) => {
      this.setState({ code: res.data.code, name: res.data.name });
    });
  }

  logout = () => {
    this.props.logoutUser();
  };

  render() {
    let { code, name } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{code}</Text>
        <Text style={styles.text}>{name}</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={this.logout}>
          <Text style={styles.loginText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "tomato",
    fontWeight: "700",
    marginBottom: 5,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "tomato",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logoutUser })(ProfilePage);

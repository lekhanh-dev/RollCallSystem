import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { loginWithUsernameAndPassword } from "../redux/actions/LoginActions";

class LoginPage extends React.Component {
  state = {
    username: "GV16510601",
    password: "GV16510601",
    error: {
      username: "",
      password: "",
    },
  };

  handleForgotPassword = () => {
    alert("Liên hệ bộ phận quản lý để lấy lại mật khẩu");
  };

  handleLogin = () => {
    if (this.state.username.trim() === "") {
      this.setState({
        error: { ...this.state.error, username: "Thông tin bắt buộc" },
      });
      return;
    }
    if (this.state.password.trim() === "") {
      this.setState({
        error: { ...this.state.error, password: "Thông tin bắt buộc" },
      });
      return;
    }
    this.props.loginWithUsernameAndPassword({ ...this.state });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Icon name="user" size={60} color="#4b4bff" />
        </View>
        <View
          style={[
            styles.inputView,
            this.state.error.username !== "" ? { borderColor: "red" } : null,
          ]}
        >
          <TextInput
            style={styles.inputText}
            placeholder="Nhập tài khoản"
            value={this.state.username}
            placeholderTextColor="#003f5c"
            onChangeText={(text) =>
              this.setState({
                username: text,
                error: { ...this.state.error, username: "" },
              })
            }
          />
        </View>
        <View style={styles.textErrorWrapper}>
          <Text style={styles.textError}>{this.state.error.username}</Text>
        </View>
        <View
          style={[
            styles.inputView,
            this.state.error.password !== "" ? { borderColor: "red" } : null,
          ]}
        >
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#003f5c"
            value={this.state.password}
            onChangeText={(text) =>
              this.setState({
                password: text,
                error: { ...this.state.error, password: "" },
              })
            }
          />
        </View>
        <View style={styles.textErrorWrapper}>
          <Text style={styles.textError}>{this.state.error.password}</Text>
        </View>
        <TouchableOpacity>
          <Text onPress={this.handleForgotPassword} style={styles.forgot}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={this.props.login.loading}
          style={[
            styles.loginBtn,
            this.props.login.loading ? { backgroundColor: "#e6e6e6" } : null,
          ]}
          onPress={this.handleLogin}
        >
          <Text style={styles.loginText}>Đăng nhập</Text>
          {this.props.login.loading && (
            <View style={[styles.containerLoading, styles.horizontal]}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )}
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
  logo: {
    marginBottom: 10,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#e6e6e6",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#5A5A5A",
    borderRadius: 25,
    height: 50,
    marginBottom: 2,
    justifyContent: "center",
    padding: 20,
  },
  textErrorWrapper: {
    width: "80%",
    marginBottom: 15,
  },
  textError: {
    color: "red",
  },
  inputText: {
    height: 50,
    color: "#5A5A5A",
  },
  forgot: {
    color: "black",
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#4b4bff",
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
  containerLoading: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

const mapStateToProps = (state) => ({
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  login: state.login,
});

export default connect(mapStateToProps, { loginWithUsernameAndPassword })(
  LoginPage
);

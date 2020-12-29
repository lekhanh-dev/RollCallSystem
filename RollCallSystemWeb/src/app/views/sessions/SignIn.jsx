import React, { Component } from "react";
import {
  Card,
  // Checkbox,
  // FormControlLabel,
  Grid,
  Button,
  withStyles,
  CircularProgress,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";

import { loginWithUsernameAndPassword } from "../../redux/actions/LoginActions";

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
});

class SignIn extends Component {
  state = {
    username: "",
    password: "",
    agreement: "",
  };
  handleChange = (event) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleFormSubmit = (event) => {
    this.props.loginWithUsernameAndPassword({ ...this.state });
  };
  render() {
    let { username, password } = this.state;
    let { classes } = this.props;
    return (
      <div className="signup flex flex-center w-100 h-100vh">
        <div className="p-8">
          <Card className="signup-card position-relative y-center">
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="p-32 flex flex-center flex-middle h-100">
                  <img src="/assets/Roll_Call_System.gif" alt="" />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="p-36 h-100 bg-light-gray position-relative">
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="mb-24 w-100"
                      variant="outlined"
                      label="Tài khoản"
                      onChange={this.handleChange}
                      type="text"
                      name="username"
                      value={username}
                      validators={["required"]}
                      errorMessages={["Trường này không được bỏ trống"]}
                    />
                    <TextValidator
                      className="mb-16 w-100"
                      label="Mật khẩu"
                      variant="outlined"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      value={password}
                      validators={["required"]}
                      errorMessages={["Trường này không được bỏ trống"]}
                    />
                    {/* <FormControlLabel
                      className="mb-8"
                      name="agreement"
                      onChange={this.handleChange}
                      control={<Checkbox checked />}
                      label="I have read and agree to the terms of service."
                    /> */}
                    <div className="flex flex-middle mb-8">
                      <div className={classes.wrapper}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={this.props.login.loading}
                          type="submit"
                        >
                          Đăng nhập
                        </Button>
                        {this.props.login.loading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                      {/* <span className="ml-16 mr-8">or</span>
                      <Button
                        className="capitalize"
                        onClick={() =>
                          this.props.history.push("/session/signup")
                        }
                      >
                        Sign up
                      </Button> */}
                    </div>
                    {/* <Button
                      className="text-primary"
                      onClick={() =>
                        this.props.history.push("/session/forgot-password")
                      }
                    >
                      Forgot password?
                    </Button> */}
                  </ValidatorForm>
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  login: state.login,
});
export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps, { loginWithUsernameAndPassword })(SignIn))
);

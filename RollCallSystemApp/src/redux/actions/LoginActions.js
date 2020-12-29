import jwtAuthService from "../../services/jwtAuthService";
import { setUserData } from "./UserActions";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const RESET_PASSWORD = "RESET_PASSWORD";

export function loginWithUsernameAndPassword({ username, password }) {
  return (dispatch) => {
    dispatch({
      type: LOGIN_LOADING,
    });

    jwtAuthService
      .loginWithUsernameAndPassword(username, password)
      .then((user) => {
        if (user.role === "ROLE_TEACHER") {
          dispatch(setUserData(user));
          return dispatch({
            type: LOGIN_SUCCESS,
          });
        } else {
          alert("Tài khoản không có quyền truy cập");
          return dispatch({
            type: LOGIN_ERROR,
          });
        }
      })
      .catch((error) => {
        let err = {};
        err.message = error.response
          ? error.response.data.message
          : "Máy chủ đang bận, mời bạn thử lại";
        alert(err.message);
        return dispatch({
          type: LOGIN_ERROR,
          data: err,
        });
      });
  };
}

export function resetPassword({ email }) {
  return (dispatch) => {
    dispatch({
      payload: email,
      type: RESET_PASSWORD,
    });
  };
}

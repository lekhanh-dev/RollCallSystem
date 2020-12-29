import jwtAuthService from "../../services/jwtAuthService";
import FirebaseAuthService from "../../services/firebase/firebaseAuthService";
import { setUserData } from "./UserActions";
import history from "history.js";

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
        dispatch(setUserData(user));
        history.push({
          pathname: "/",
        });

        return dispatch({
          type: LOGIN_SUCCESS,
        });
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

export function firebaseLoginEmailPassword({ email, password }) {
  return (dispatch) => {
    FirebaseAuthService.signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          dispatch(
            setUserData({
              userId: "1",
              role: "ADMIN",
              displayName: "Watson Joyce",
              email: "watsonjoyce@gmail.com",
              photoURL: "/assets/images/face-7.jpg",
              age: 25,
              token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh",
              ...user,
            })
          );

          history.push({
            pathname: "/",
          });

          return dispatch({
            type: LOGIN_SUCCESS,
          });
        } else {
          return dispatch({
            type: LOGIN_ERROR,
            payload: "Login Failed",
          });
        }
      })
      .catch((error) => {
        return dispatch({
          type: LOGIN_ERROR,
          payload: error,
        });
      });
  };
}

import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_LOADING,
} from "../actions/LoginActions";
import { LOGOUT } from "../actions/UserActions";

const initialState = {
  success: false,
  loading: false,
  error: {
    username: null,
    password: null,
  },
};

const LoginReducer = function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        success: true,
        loading: false,
      };
    }
    case LOGIN_ERROR: {
      return {
        success: false,
        loading: false,
        error: action.data,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        success: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default LoginReducer;

import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import UserReducer from "./UserReducer";

const RootReducer = combineReducers({
  login: LoginReducer,
  user: UserReducer,
});

export default RootReducer;

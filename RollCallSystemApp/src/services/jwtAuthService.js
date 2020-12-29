import axios from "axios";
import asyncStorageService from "./asyncStorageService";
import ConstantList from "../../appConfig";

class JwtAuthService {
  user = {};

  loginWithUsernameAndPassword = (username, password) => {
    return axios
      .post(`${ConstantList.API_ENDPOINT}/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        this.setSession(res.data.accessToken);
        // // Set user
        this.user.role = res.data.roles[0];
        this.user.displayName = res.data.username;
        this.user.token = res.data.accessToken;
        this.setUser(this.user);
        return this.user;
      });
  };

  logout = () => {
    this.setSession(null);
    this.removeUser();
  };

  setSession = (token) => {
    if (token) {
      asyncStorageService.setStringValue("token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      asyncStorageService.removeValue("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  setUser = (user) => {
    asyncStorageService.setObjectValue("auth_user", user);
  };

  removeUser = () => {
    asyncStorageService.removeValue("auth_user");
  };
}

export default new JwtAuthService();

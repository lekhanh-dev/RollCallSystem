import axios from "axios";
import localStorageService from "./localStorageService";
import ConstantList from "../appConfig";
class JwtAuthService {
  // Dummy user object just for the demo
  user = {
    // userId: "1",
    // role: 'ROLE_ADMIN',
    // displayName: "Jason Alexander",
    // email: "jasonalexander@gmail.com",
    photoURL: "/assets/images/avatar.jpg",
    // age: 25,
    // token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh"
  };

  // You need to send http request with email and passsword to your server in this method
  // Your server will return user object & a Token
  // User should have role property
  // You can define roles in app/auth/authRoles.js
  loginWithUsernameAndPassword = (username, password) => {
    return axios
      .post(`${ConstantList.API_ENDPOINT}/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        this.setSession(res.data.accessToken);
        // Set user
        this.user.role = res.data.roles[0];
        this.user.displayName = res.data.username;
        this.user.token = res.data.accessToken;
        this.setUser(this.user);
        return this.user;
      });
  };

  // You need to send http requst with existing token to your server to check token is valid
  // This method is being used when user logged in & app is reloaded
  loginWithToken = () => {
    return axios
      .post(`${ConstantList.API_ENDPOINT}/valid-token`, {
        token: localStorage.getItem("jwt_token"),
      })
      .then((res) => {
        // console.log(res);
        this.setSession(res.data.accessToken);
        // Set user
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

  // Set token to all http request header, so you don't need to attach everytime
  setSession = (token) => {
    if (token) {
      localStorage.setItem("jwt_token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("jwt_token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Save user to localstorage
  setUser = (user) => {
    localStorageService.setItem("auth_user", user);
  };
  // Remove user from localstorage
  removeUser = () => {
    localStorage.removeItem("auth_user");
  };
}

export default new JwtAuthService();

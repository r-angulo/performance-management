import { SET_CURRENT_USER } from "./types";

import setAuthToken from "../utils/setAuthToken";

import jwt_decode from "jwt-decode";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  // if success dispatch with setCurrentUser else dispatch with errroaxios
  axios
    .post("/api/shared/login", userData)
    .then((res) => {
      const { token } = res.data;
      console.log("token");
      console.log(token);
      localStorage.setItem("jwtToken", token); //very important that this is the same as the app.js
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      history.push("/home");
    })
    .catch((err) => {
      console.log("error login in user in action " + err);
    });
};

export const setCurrentUser = (decoded) => {
  console.log("set current user");
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};

// export const switchLevel(level){
//   loginUser
// }

//dont forget to do
///1 set current user
//2. reducer
//3. utils auth token
// setup store
//4. app.js

//STEPS
//1. setup concurrently
//2. in the login form is next, copy everythjing as is
//3. then create actions login and set current user
//3.5 create utils to make axios set auth header
//4. then create reducer
//5. then in app.js setup so auth everywhere

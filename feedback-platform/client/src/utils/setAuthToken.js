import axios from "axios";
//always attaches auth header

//TODO: dont forget App

const setAuthToken = (token) => {
  if (token) {
    //if the token exist
    //apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //if there is no token, delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;

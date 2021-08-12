import { GET_ALL_EDIT_EMPLOYEES, GET_ONE_EMPLOYEE_DATA } from "./types";
import axios from "axios";

export const getEmployeesToEdit = () => (dispatch) => {
  axios
    .get("/api/admin/allemployees")
    .then((res) => {
      console.log(res.data);
      dispatch({ type: GET_ALL_EDIT_EMPLOYEES, payload: res.data });
    })
    .catch((err) => {
      console.log("error fetching employees: " + err);
    });
};

export const getEmployeeData = (id) => (dispatch) => {
  axios
    .get(`/api/admin/employeedata/${id}`)
    .then((res) => {
      dispatch({ type: GET_ONE_EMPLOYEE_DATA, payload: res.data });
    })
    .catch((err) => {
      console.log("could not get data for this employee");
    });
};

export const setEmployeeData = (userObj, history) => (dispatch) => {
  axios
    .post(`/api/admin/updateemployee/${userObj._id}`, userObj)
    .then((res) => {
      console.log(res);
      history.push("/editemployees");
    })
    .catch((err) => {
      console.log("error occured while updating user" + err);
    });
};

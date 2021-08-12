import {
  GET_PROJECTS_FOR_EMPLOYEE,
  GET_PEERS_FOR_PROJECT,
  GET_ONE_FEEDBACK,
  GET_PROJECT_MEASURES,
} from "./types";
import axios from "axios";

export const getProjectsForEmployee = (id) => (dispatch) => {
  axios
    .get(`/api/employee/projectsfor/${id}`)
    .then((res) => {
      dispatch({ type: GET_PROJECTS_FOR_EMPLOYEE, payload: res.data });
    })
    .catch((err) => {
      console.log("could not get data for this employee");
    });
};

export const getPeersForThisProject = (queryObj) => (dispatch) => {
  axios
    .get(
      `/api/employee/projectpeers?projID=${queryObj.projID}&currUser=${queryObj.currUser}`
    )
    .then((res) => {
      dispatch({ type: GET_PEERS_FOR_PROJECT, payload: res.data });
    })
    .catch((err) => {
      console.log("could not get data for this employee");
    });
};

export const getMeasures = (projID) => (dispatch) => {
  axios
    .get(`/api/employee/projectMeasures/${projID}`)
    .then((res) => {
      dispatch({ type: GET_PROJECT_MEASURES, payload: res.data });
    })
    .catch((err) =>
      console.log("could not get remaining measures, err: " + err)
    );
};

export const getOneFeedback = (queryObj) => (dispatch) => {
  axios
    .get(
      `/api/employee/oneresponse/?projID=${queryObj.projID}&fromID=${queryObj.fromID}&toID=${queryObj.toID}&measureID=${queryObj.measureID}`
    )
    .then((res) => {
      dispatch({ type: GET_ONE_FEEDBACK, payload: res.data });
    })
    .catch((err) =>
      console.log("could not get remaining measures, err: " + err)
    );
};

export const postOneFeedback = (postObj) => (dispatch) => {
  axios
    .post("/api/employee/pushfeedback/", postObj)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

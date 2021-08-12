import {
  CREATE_PROJECT_NAME,
  GET_ALL_MEASURES,
  GET_THIS_PROJECT_MEASURES,
  GET_PROJECTS_FOR_MANAGER,
} from "./types";
import axios from "axios";

export const createProjectName = (postObj, history) => (dispatch) => {
  console.log("called create project name with");
  console.log(postObj);
  axios
    .post("/api/manager/project/name", postObj)
    .then((res) => {
      localStorage.setItem("currentProjectID", res.data._id);
      dispatch({ type: CREATE_PROJECT_NAME, payload: res.data._id });
    })
    .catch((err) =>
      console.log("error occured while attempting to create project: " + err)
    );
};

export const addEmployeesToProject = (postObj, history) => (dispatch) => {
  axios
    .post("/api/manager/project/employees", postObj)
    .then((res) => {
      console.log("Added employees successfully");
      console.log(res);
    })
    .catch((err) => console.log("error occured adding employees: " + err));
};

export const createNewMeasure = (measureObj) => (dispatch) => {
  axios
    .post("/api/shared/createmeasure", measureObj)
    .then((res) => {
      console.log("succesfully created new measure");
    })
    .catch((err) => console.log("error in creating new measure: " + err));
};

export const getAllMeasures = () => (dispatch) => {
  axios
    .get("/api/shared/allmeasures")
    .then((res) => {
      dispatch({ type: GET_ALL_MEASURES, payload: res.data });
    })
    .catch((err) =>
      console.log("error occured while getting measures: " + err)
    );
};

export const addMeasuresToProject = (postObj, history) => (dispatch) => {
  axios
    .post("/api/manager/project/measures", postObj)
    .then((res) => {
      console.log("Added measures successfully");
      console.log(res);
    })
    .catch((err) => console.log("error occured adding measures: " + err));
};

export const getProjectMeasures = (projectID) => (dispatch) => {
  axios
    .get("/api/manager/project/measures/" + projectID)
    .then((res) =>
      dispatch({ type: GET_THIS_PROJECT_MEASURES, payload: res.data })
    )
    .catch((err) =>
      console.log("error occured while getting project measures: " + err)
    );
};

export const addMeasuresAndWeightsToProject = (postObj, history) => (
  dispatch
) => {
  axios
    .post("/api/manager/project/weights", postObj)
    .then((res) => {
      console.log("Added weights successfully");
      console.log(res.data);
    })
    .catch((err) => console.log("error occured adding measures: " + err));
};

export const addSettingsToProject = (postObj, history) => (dispatch) => {
  axios
    .post("/api/manager/project/settings", postObj)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) =>
      console.log("error occured while updating measures: " + err)
    );
};

export const saveProject = (postObj, callback) => (dispatch) => {
  axios
    .post("/api/manager/project/save", postObj)
    .then((res) => {
      callback();
    })
    .catch((err) =>
      console.log("error occured while updating measures: " + err)
    );
};

export const getProjectsForManager = (managerID) => (dispatch) => {
  axios
    .get("/api/manager/projects/" + managerID)
    .then((res) => {
      dispatch({ type: GET_PROJECTS_FOR_MANAGER, payload: res.data });
    })
    .catch((err) =>
      console.log("error occured while updating measures: " + err)
    );
};

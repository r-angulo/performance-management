import {
  CREATE_PROJECT_NAME,
  GET_ALL_MEASURES,
  GET_THIS_PROJECT_MEASURES,
  GET_PROJECTS_FOR_MANAGER,
} from "../actions/types";

const initialState = {
  currentProjectId: 0,
  allMeasures: [],
  thisProjectMeasures: [],
  managersProjects: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_PROJECT_NAME:
      return {
        ...state,
        currentProjectId: action.payload._id,
      };
    case GET_ALL_MEASURES:
      return {
        ...state,
        allMeasures: action.payload,
      };
    case GET_THIS_PROJECT_MEASURES:
      return {
        ...state,
        thisProjectMeasures: action.payload,
      };
    case GET_PROJECTS_FOR_MANAGER:
      return {
        ...state,
        managersProjects: action.payload,
      };
    default:
      return state;
  }
}

import {
  GET_PROJECTS_FOR_EMPLOYEE,
  GET_PEERS_FOR_PROJECT,
  GET_PROJECT_MEASURES,
  GET_ONE_FEEDBACK,
} from "../actions/types";

const initialState = {
  thisEmployeeProjects: [],
  thisProjectPeers: [],
  thisProjectMeasures: [],
  currentFeedback: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PROJECTS_FOR_EMPLOYEE:
      return {
        ...state,
        thisEmployeeProjects: action.payload,
      };

    case GET_PEERS_FOR_PROJECT:
      return {
        ...state,
        thisProjectPeers: action.payload,
      };
    case GET_PROJECT_MEASURES:
      return {
        ...state,
        thisProjectMeasures: action.payload,
      };
    case GET_ONE_FEEDBACK:
      return {
        ...state,
        currentFeedback: action.payload,
      };
    default:
      return state;
  }
}

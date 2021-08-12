import {
  GET_ALL_EDIT_EMPLOYEES,
  GET_ONE_EMPLOYEE_DATA,
} from "../actions/types";

const initialState = {
  allEmployeesData: [],
  oneEmployeeData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_EDIT_EMPLOYEES:
      return {
        ...state,
        allEmployeesData: action.payload,
      };
    case GET_ONE_EMPLOYEE_DATA:
      return {
        ...state,
        oneEmployeeData: action.payload,
      };
    default:
      return state;
  }
}

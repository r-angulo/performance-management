import { combineReducers } from "redux";
import authReducer from "./authReducer";
import adminReducer from "./adminReducer";
import navReducer from "./navReducer";
import managerReducer from "./managerReducer";
import employeeReducer from "./employeeReducer";

export default combineReducers({
  auth: authReducer, //this is how we will refer to it
  admin: adminReducer,
  nav: navReducer,
  mananger: managerReducer,
  employee: employeeReducer,
});

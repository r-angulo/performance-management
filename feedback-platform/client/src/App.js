import React, { Component } from "react";

import "./css/global.css";
import Projects from "./components/layout/Employee/Projects";
import EmployeeHome from "./components/layout/Employee/EmployeeHome";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Project from "./components/layout/Employee/Project";
import Results from "./components/layout/Employee/Results";
import Score from "./components/layout/Employee/Score";
import ProjectSetupEmployees from "./components/layout/Manager/ProjectSetupEmployees";
import ManagerHome from "./components/layout/Manager/ManagerHome";
import ProjectSetupName from "./components/layout/Manager/ProjectSetupName";
import ProjectSetupSettings from "./components/layout/Manager/ProjectSetupSettings";
import ProjectSetupMeasures from "./components/layout/Manager/ProjectSetupMeasures";
import CreateNewAccount from "./components/layout/Admin/CreateNewAccount";
import EditEmployees from "./components/layout/Admin/EditEmployees";
import NavBar from "./components/layout/Nav/NavBar";
import Login from "./components/layout/Login";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux"; //a wrapper that provides our application with the global store
import AdminHome from "./components/layout/Admin/AdminHome";
import EditEmployee from "./components/layout/Admin/EditEmployee";
import Account from "./components/layout/Account";
import SwitchAccount from "./components/layout/SwitchAccount";
import Home from "./components/layout/Home";
import ProjectMeasuresContainer from "./components/layout/Manager/ProjectMeasuresContainer";
import CreateMeasure from "./components/layout/CreateMeasure";
import ProjectSetupWeights from "./components/layout/Manager/ProjectSetupWeights";
import ProjectAddMeasure from "./components/layout/Manager/ProjectAddMeasure";
import ManagersList from "./components/layout/Admin/ManagersList";
import EditRelation from "./components/layout/Admin/EditRelation";
import ProjectContainer from "./components/layout/Manager/ProjectContainer";
import CreateManyNewAccounts from "./components/layout/Admin/CreateManyNewAccounts";
import FileReader from "./components/layout/Admin/FileReader";
import ProjectResults from "./components/layout/Manager/ProjectResults";

import Performance from "./components/layout/Performance";
import InProgress from "./components/layout/Manager/InProgress";
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  //do provider store
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    //todo: create clear current profile action
    window.location.href = "/login";
  }
}
//TODO: check if still auth and check auth for each page
//TODO: feedback from clients and customers whjoch means expanding it to smalelr transactions or a big one
//TODO: expand with intercom??? for our expertise and handling of feed back feelings the best
//FORCE USER TO ACTUALLY THINK ABOUT THE FEEDBACK
//HUMANS ARE ADDICTED TO FAST RESULTS NOWADAYS, MAKE THIS AS FAST AS POSSIBLE ,LIKE RIGHT AFTER YOU DO AN ACTION, BUT HOW WILL THEY FEEL THE NEXT DAY
//TODO:different types of scores for different measures, like the oine from 16peronslaites
//TODO: how does changing scales 0-5 0-10 0-100 change behavior
//TODO: show improvement over time on same meausre and overall score
//TODO: import scores from previos project
//FOR manager: view by employee, view by measure who was best, put them all toegher, what was the average review for ths measures
//feedback on the project overall enable option
//let employees know that theyir comments will be seen by peers or by peers and manager when wrirting
//TODO: when accessing a page bie id or project id check if it actually exists
//MAKE SURE ALL FORM REALTED COMPOINENTE HAVE A FORM
//TODO: if you want large companies plant for large inputs, goal, actions are creating a csv loader
//TODO: look into the proper way of doing setstate
//TODO: this is quite boring ux, make it more fun like more emotion faces ??? or gamify it seduce it
//TODO: expand to feedback to the companys profjects and how to do things from employess, posibly provded feedback on strategy
//TODO: IF YOU HAVE two pages open login and then logout , you shouldnt see it anymore

//TODO: how to improve on something
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <NavBar></NavBar>
            <Route exact path="/login" component={Login}></Route>

            <Route exact path="/" component={Home}></Route>
            <Route exact path="/projects" component={Projects}></Route>
            <Route exact path="/project/:projectID" component={Project}></Route>
            <Route exact path="/results/:projectID" component={Results}></Route>
            <Route
              exact
              path="/project-results/:projectID"
              component={ProjectResults}
            ></Route>
            <Route exact path="/score" component={Score}></Route>
            <Route exact path="/allmanagers" component={ManagersList}></Route>
            <Route
              exact
              path="/create-project"
              component={ProjectContainer}
            ></Route>
            <Route
              exact
              path="/subordinates/:id"
              component={EditRelation}
            ></Route>

            <Route
              exact
              path="/projectsetup/employees"
              component={ProjectSetupEmployees}
            ></Route>

            <Route
              exact
              path="/projectsetup/name"
              component={ProjectSetupName}
            ></Route>

            <Route
              exact
              path="/projectsetup/weights"
              component={ProjectSetupWeights}
            ></Route>

            <Route
              exact
              path="/projectsetup/settings"
              component={ProjectSetupSettings}
            ></Route>
            <Route
              exact
              path="/projectsetup/measures"
              component={ProjectSetupMeasures}
            ></Route>
            {/* <Route
            exact
            path="/projectsetup/addmeasures"
            component={ProjectMeasuresContainer}
          ></Route> */}
            <Route
              exact
              path="/projectsetup/addmeasures"
              component={ProjectAddMeasure}
            ></Route>

            <Route
              exact
              path="/register-one-employee"
              component={CreateNewAccount}
            ></Route>
            <Route
              exact
              path="/register-many-employees"
              component={CreateManyNewAccounts}
              // component={FileReader}
            ></Route>
            <Route
              exact
              path="/editemployees"
              component={EditEmployees}
            ></Route>
            <Route
              exact
              path="/editemployee/:id"
              component={EditEmployee}
            ></Route>
            <Route
              exact
              path="/createmeasure"
              component={CreateMeasure}
            ></Route>
            <Route exact path="/adminhome" component={AdminHome}></Route>

            <Route exact path="/managerhome" component={ManagerHome}></Route>
            <Route exact path="/account" component={Account}></Route>
            <Route exact path="/switch" component={SwitchAccount}></Route>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/performance" component={Performance}></Route>
            <Route
              exact
              path="/project-progress/:projectID"
              component={InProgress}
            ></Route>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

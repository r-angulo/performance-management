import React, { Component } from "react";
import { connect } from "react-redux";
import ProjectSetupName from "./ProjectSetupName";
import ProjectSetupEmployees from "./ProjectSetupEmployees";
import ProjectAddMeasure from "./ProjectAddMeasure";
import ProjectSetupWeights from "./ProjectSetupWeights";
import ProjectSetupSettings from "./ProjectSetupSettings";
import { updateNavTitle } from "../../../actions/navActions";

//NOTE: keeping which page goes after and before may be bad practice or good if its like a linked list
//TODO: localstorage and encrtpy it
//TODO: delete localstore on unmount
//TODO: should it also save on prev clicked
//TODO: if componne will unmount and not yet published, delete it
//note when refersh it takes you to new pages. and employees are not loading
//TODO: when save and finshin its not pushig to home
class ProjectContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: "NameAndDescription",
    };
    this.changePage = this.changePage.bind(this);
  }

  changePage(pageName) {
    this.setState({ currentPage: pageName });
  }

  directToHome() {
    this.props.history.push("/home");
  }

  // componentDidMount() {
  //   if (localStorage.getItem("currentProjectID") !== null) {
  //     localStorage.removeItem("currentProjectID");
  //   }
  // }

  componentDidMount() {
    this.props.updateNavTitle("Create New Project");
  }
  componentWillUnmount() {
    if (localStorage.getItem("currentProjectID") !== null) {
      localStorage.removeItem("currentProjectID");
    }
  }

  render() {
    console.log(this.state);
    let renderElement = null;
    if (this.state.currentPage === "NameAndDescription") {
      renderElement = (
        <ProjectSetupName
          nextClicked={() => {
            this.changePage("AddEmployees");
          }}
        ></ProjectSetupName>
      );
    }
    if (this.state.currentPage === "AddEmployees") {
      renderElement = (
        <ProjectSetupEmployees
          prevClicked={() => {
            this.changePage("NameAndDescription");
          }}
          nextClicked={() => {
            this.changePage("AddMeasures");
          }}
        ></ProjectSetupEmployees>
      );
    }
    if (this.state.currentPage === "AddMeasures") {
      renderElement = (
        <ProjectAddMeasure
          prevClicked={() => {
            this.changePage("AddEmployees");
          }}
          nextClicked={() => {
            this.changePage("EditWeights");
          }}
        ></ProjectAddMeasure>
      );
    }
    if (this.state.currentPage === "EditWeights") {
      renderElement = (
        <ProjectSetupWeights
          prevClicked={() => {
            this.changePage("AddMeasures");
          }}
          nextClicked={() => {
            this.changePage("EditSettings");
          }}
        ></ProjectSetupWeights>
      );
    }
    if (this.state.currentPage === "EditSettings") {
      renderElement = (
        <ProjectSetupSettings
          prevClicked={() => {
            this.changePage("EditWeights");
          }}
          directToHome={() => {
            this.directToHome();
          }}
        ></ProjectSetupSettings>
      );
    }

    return <div>{renderElement}</div>;
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
});

export default connect(mapStateToProps, { updateNavTitle })(ProjectContainer);
//1. Project setup name
//2. employees
//3. measure
//4. score weights
//5. settings

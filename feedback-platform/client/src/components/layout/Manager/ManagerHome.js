import React, { Component } from "react";
import Cell from "../../display/Cell";
import { Link } from "react-router-dom";
import { getProjectsForManager } from "../../../actions/managerActions";
import { connect } from "react-redux";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Spinner from "../../display/Spinner";

//todo: make it so that isPublished actually works
//TODO: add deadline
//NOTE :COMPLETION RATE FORUMAL IS OFF??
//TODO: Take to page while employees stil filoing it out, like remind them to do this, also see whose on
//todo: sometimes error 500 occursa when fetching project while reoaldog idk why
//WHY ARE ELEMENTS INT STATE
//IF NOT IS PUBLISHED, SET LOCAL STORATE TO THAT ID THEN SEND THERE
//NOTE: right side onclick delete not working, maybe not the best palce here
///NOTE: CHECK THE PROJECT IS CLIKED
class ManagerHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectsData: [],
      isLoading: true,
    };
    this.projectClicked = this.projectClicked.bind(this);
  }

  getProjectsForManager() {
    axios
      .get("/api/manager/projects/" + this.props.auth.user.id)
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        this.setState({ projectsData: res.data, isLoading: false });
      })
      .catch((err) =>
        console.log("error occured while updating measures: " + err)
      );
  }

  componentDidMount() {
    this.getProjectsForManager();
  }

  projectClicked(projectID) {
    let project = this.state.projectsData.filter(
      (project) => projectID === project._id
    );
    if (project[0].completion === 1 && project[0].isLive) {
      this.props.history.push("/project-results/" + project[0]._id);
    } else {
      if (project[0].completion === 1 && !project[0].isLive) {
        this.props.history.push("/project-progress/" + projectID);
      }
      if (project[0].completion <= 1 && project[0].isPublished) {
        //take to see who is pushing
        console.log("take to see who is pushing");
        this.props.history.push("/project-progress/" + projectID);
      } else {
        console.log("take to edit");
        //take to edit
        this.props.history.push("/create-project");
        localStorage.setItem("currentProjectID", projectID);
      }
    }
  }

  linkToNewProject() {
    if (localStorage.getItem("currentProjectID") !== null) {
      localStorage.removeItem("currentProjectID");
    }
    axios
      .post("/api/manager/project/create/" + this.props.auth.user.id)
      .then((res) => {
        console.log("new add");
        localStorage.setItem("currentProjectID", res.data.id);
        this.props.history.push("/create-project");
      })
      .catch((err) => {});
  }

  deleteProject(projectID) {
    axios
      .delete("/api/manager/project/delete/" + projectID)
      .then((res) => {
        console.log("success delete");
        this.getProjectsForManager();
      })
      .catch((err) => {
        console.log("fail delete");
      });
  }

  render() {
    let managerProjects = this.state.projectsData.map((project) => {
      return (
        <Cell
          key={project._id}
          title={project.name ? project.name : "Untitled Project"}
          description={
            project.isPublished
              ? "Completion Rate: " +
                (project.completion * 100).toFixed(2) +
                "%"
              : "Finish Creating Project"
          }
          rightSide={
            !project.isPublished && (
              <div
                style={{ width: "30px" }}
                onClick={() => this.deleteProject(project._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path
                    fill="#ff4f60"
                    d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                  ></path>
                </svg>
              </div>
            )
          }
          onClick={() => this.projectClicked(project._id)}
        ></Cell>
      );
    });
    return (
      <div className="home-container">
        <div className="container">
          <h2 style={{ width: "100%", textAlign: "center" }}>Your Projects</h2>
          <button
            type="submit"
            className="button"
            onClick={() => this.linkToNewProject()}
          >
            Create New Project
          </button>

          {this.state.isLoading ? <Spinner></Spinner> : managerProjects}
        </div>
        {/* <div className="container">
          <h2 style={{ textAlign: "center" }}>Your Employees Perfomance</h2>
          <Cell
            title="Employee Name"
            description="Number of projects: 3"
          ></Cell>
          <Cell></Cell>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  mananger: state.mananger,
  auth: state.auth,
});

const mapDispatchToProps = {};

export default withRouter(
  connect(mapStateToProps, { getProjectsForManager })(ManagerHome)
);

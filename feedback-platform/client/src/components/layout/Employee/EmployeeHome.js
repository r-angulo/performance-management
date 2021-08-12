import React, { Component } from "react";
import Cell from "../../display/Cell";
import Gauge from "../../display/Gauge";
import { connect } from "react-redux";
import { getProjectsForEmployee } from "../../../actions/employeeActions";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../../display/Spinner";

class EmployeeHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeProjectData: [],
      isLoading: true,
    };
    this.projectClicked = this.projectClicked.bind(this);
  }

  getProjectsForEmployee() {
    axios
      .get(`/api/employee/projectcompletionrates/${this.props.auth.user.id}`)
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        this.setState({ employeeProjectData: res.data, isLoading: false });
      })
      .catch((err) => {
        console.log("could not get data for this employee");
      });
  }

  componentDidMount() {
    this.getProjectsForEmployee();
  }

  projectClicked(projectID) {
    let project = this.state.employeeProjectData.filter(
      (project) => projectID === project.id
    );
    if (project[0].isLive && project[0].completionRate === 1) {
      this.props.history.push(`/results/${projectID}`);
    }
    if (project[0].completionRate < 1) {
      this.props.history.push(`/project/${projectID}`);
    }
  }

  render() {
    console.log(this.props);
    let employeeProjectsElements = this.state.employeeProjectData.map(
      (project) => {
        return (
          <Cell
            key={project.id}
            title={project.name}
            description={project.completionRate.toFixed(4) * 100 + "%"}
            onClick={() => this.projectClicked(project.id)}
          ></Cell>
        );
      }
    );
    return (
      <div className="home-container">
        <div className="container">
          <h2 style={{ width: "100%", textAlign: "center" }}>Your Projects</h2>

          {this.state.isLoading ? (
            <Spinner></Spinner>
          ) : (
            employeeProjectsElements
          )}
        </div>
        {/* <div className="container">
          <h2 style={{ textAlign: "center" }}>Your Employeess Performance</h2>
          <Link to="/performance" style={{ color: "white" }}>
            Overtime
          </Link>
          <div className="all-gauge-containers">
            <Gauge title="Last Quarter" value={75}></Gauge>
            <Gauge title="This Quarter" value={95}></Gauge>
            <Gauge title="Rank" value={1}></Gauge>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  employee: state.employee,
  auth: state.auth,
});

const mapDispatchToProps = {};

export default withRouter(
  connect(mapStateToProps, { getProjectsForEmployee })(EmployeeHome)
);

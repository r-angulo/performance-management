import React, { Component } from "react";
import axios from "axios";
import TextField from "../../display/TextField";
import Cell from "../../display/Cell";
import ToggableButton from "../../display/ToggableButton";
import { updateNavTitle } from "../../../actions/navActions";
import { connect } from "react-redux";

//check id id is real ie is found project
//TODO: add overall completion rate
//TODO: send reminder email rn or later 2days before due date
class InProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectID: "",
      projName: "",
      isLive: false,
      searchTerm: "",
      employeeData: [],
      isDescending: false,
      overallCompletionRate: 0,
    };

    this.makeProjectLive = this.makeProjectLive.bind(this);
  }

  getProjectDetails() {
    axios
      .get("/api/manager/project-progress/" + this.props.match.params.projectID)
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        this.setState({
          isLive: res.data.isLive,
          employeeData: res.data.employeeProgress,
          projName: res.data.projName,
          overallCompletionRate: res.data.overallCompletionRate,
        });
      })
      .catch((err) =>
        console.log("error occured while updating measures: " + err)
      );
  }

  makeProjectLive() {
    axios
      .put("/api/manager/makeProjectLive/" + this.props.match.params.projectID)
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        this.getProjectDetails();
      })
      .catch((err) =>
        console.log("error occured while updating measures: " + err)
      );
  }

  componentDidMount() {
    this.getProjectDetails();
    this.props.updateNavTitle("Progress");
  }

  sortByProgress() {
    this.setState({ isDescending: !this.state.isDescending }, () => {
      let _employeeData = this.state.employeeData;
      if (this.state.isDescending) {
        _employeeData.sort((a, b) =>
          a.progress > b.progress ? 1 : b.progress > a.progress ? -1 : 0
        );
      } else {
        _employeeData.sort((a, b) =>
          a.progress > b.progress ? -1 : b.progress > a.progress ? 1 : 0
        );
      }
      this.setState({ employeeData: _employeeData });
    });
  }

  render() {
    let displayData = this.state.employeeData;
    if (this.state.searchTerm !== "") {
      displayData = displayData.filter(
        (employee) =>
          employee.fullName
            .toLowerCase()
            .includes(this.state.searchTerm.toLowerCase()) ||
          employee.email
            .toLowerCase()
            .includes(this.state.searchTerm.toLowerCase())
      );
    }
    let employeeItems = displayData.map((employee) => (
      <Cell
        key={employee.id}
        title={`${employee.fullName} (${employee.email}) `}
        description={employee.progress.toFixed(2) * 100 + "%"}
        data-index={employee.id}
        rightSide={
          employee.progress < 1.0 ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "35%",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#f3ff39"
                    d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"
                  ></path>
                </svg>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "35%",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#56ac8a"
                    d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
                  ></path>
                </svg>
              </div>
            </div>
          )
        }
        // onClick={() => this.handler(employee.id)}
      ></Cell>
    ));
    return (
      <div>
        <div className="container">
          <h1 style={{ width: "100%", textAlign: "center" }}>
            {this.state.projName}
          </h1>
          <h3
            style={{ width: "100%", textAlign: "center", fontWeight: "normal" }}
          >
            Due Date: TODO
          </h3>
        </div>

        {/* when 100% completion */}

        {this.state.isLive && (
          <div className="container">
            <div
              className=""
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Employees Can See Final Results</h2>{" "}
              <div
                className=""
                style={{
                  width: "50px",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#69ffc4"
                    d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        )}
        {!this.state.isLive && this.state.overallCompletionRate === 1 && (
          <div className="container">
            <div
              className=""
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Send Out Final Results</h2>{" "}
              <div
                className=""
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "dodgerblue",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "nowrap",
                  borderRadius: "50%",
                  boxShadow: "0 0 20px rgba(0,0, 0, 0.7)",
                }}
                onClick={this.makeProjectLive}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "25px" }}
                >
                  <path
                    fill="white"
                    d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                    class=""
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        )}
        {!this.state.isLive && this.state.overallCompletionRate < 1 && (
          <div className="container">
            <div
              className=""
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Overall Completion Rate</h2>{" "}
              <div
                className=""
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "nowrap",
                }}
                onClick={this.makeProjectLive}
              >
                <h2>
                  {this.state.overallCompletionRate.toFixed(2) * 100 + "%"}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* employees completion rate */}
        {/* send email*/}
        <div className="container">
          <h2>Employees</h2>
          <TextField
            placeholder="Search for Employee"
            onChange={(e) => {
              this.setState({ searchTerm: e.target.value });
            }}
            value={this.state.searchTerm}
          ></TextField>
          <div
            className=""
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {" "}
            <ToggableButton
              title={"Sort By Completion Rate"}
              altTitle={"Reverse Sort By Completion Rate"}
              svgData={
                "M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.77 160 16 160zm416 0H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
              }
              altSvgData={
                "M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-128-64h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm256-192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
              }
              viewBox={"0 0 512 512"}
              altViewBox={"0 0 512 512"}
              onClick={() => {
                this.sortByProgress();
              }}
            ></ToggableButton>
          </div>
          {employeeItems}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  nav: state.nav,
});

export default connect(mapStateToProps, { updateNavTitle })(InProgress);

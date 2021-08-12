import React, { Component } from "react";
import TextField from "../../display/TextField";
import SegmentedControl from "../../display/SegmentedControl";
import Cell from "../../display/Cell";
import { connect } from "react-redux";
import { addEmployeesToProject } from "../../../actions/managerActions";
import axios from "axios";
// import { addEmployeesToProject } from "../../../actions/managerActions";
//TODO: eventaully replaced this with only employees who work under this manager
//TODO: change cell to email, also what other info to show incase multiplke same name employees
//TODO: do the search for both
//TODO: do add all option
//TODO: when click previous add proj id, or in container simply it in state for the main main container
///TODO: MAKE THIS CODE SIMPLER
//TODO: add email to description
//VALIDATION: has to have 2 or more employees, how is manager providing feedback tho , ADD setting manager can rate but they cant reate manager
//and can they rate self???
//TODO: add all employees not working proerpy
class ProjectSetupEmployees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonSelectedEmployees: [],
      selectedEmployees: [],
      searchData: [],
      isTyping: false,
      isAdding: true,
      searchTerm: "",
    };
    //on init, load all data into nonselectedemployees
    //if user clicks add to that cell, remove from nonselectred, add to slected
    //if user clicks remove to that cell, remove from selected add to non selected
    this.handleSegmentClicked = this.handleSegmentClicked.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.saveEmployeesAdded = this.saveEmployeesAdded.bind(this);
    this.addRemoveEmployees = this.addRemoveEmployees.bind(this);
  }

  getSubordinates() {
    console.log("called get subordinates");
    axios
      .get(
        "/api/manager/project/employees/" +
          localStorage.getItem("currentProjectID")
      )
      .then((res) => {
        console.log(res.data);

        this.setState({ nonSelectedEmployees: res.data.nonAddedSubordinates });
        this.setState({ selectedEmployees: res.data.addedEmployees });
      })
      .catch((err) => {
        console.log("error occured while fetching subordinates: " + err);
      });
  }
  componentDidMount() {
    this.getSubordinates();
  }

  searchHandler(e) {
    let searchTerm = e.target.value.toLowerCase();

    this.setState({ searchTerm });

    console.log(searchTerm);
    if (this.state.isAdding) {
      var searchedEmployees = this.state.nonSelectedEmployees.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(searchTerm) ||
          employee.email.toLowerCase().includes(searchTerm)
      );
      this.setState({ searchData: searchedEmployees });
      // this.createEmployeeElements(searchedEmployees, "Add");
    } else {
      var searchedEmployees = this.state.selectedEmployees.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(searchTerm) ||
          employee.email.toLowerCase().includes(searchTerm)
      );
      this.setState({ searchData: searchedEmployees });

      // this.createEmployeeElements(searchedEmployees, "Remove");
    }
  }

  addRemoveEmployees() {
    console.log(this.state.isAdding, "add employees");
    if (this.state.isAdding) {
      this.setState({
        selectedEmployees: [
          ...this.state.selectedEmployees,
          ...this.state.nonSelectedEmployees,
        ],
      });
    } else {
      this.setState({
        nonSelectedEmployees: [
          ...this.state.selectedEmployees,
          ...this.state.nonSelectedEmployees,
        ],
      });
    }
  }

  handler(e) {
    this.setState({ searchTerm: "" });

    if (this.state.isAdding) {
      //add selected element to
      this.setState(
        {
          selectedEmployees: [...this.state.selectedEmployees, e],
        },
        () => {
          this.setState({
            nonSelectedEmployees: this.state.nonSelectedEmployees.filter(
              (employee) => employee !== e
            ),
          });
        }
      );
    }
    if (!this.state.isAdding) {
      //add selected element to
      this.setState(
        {
          nonSelectedEmployees: [...this.state.nonSelectedEmployees, e],
        },
        () => {
          this.setState({
            selectedEmployees: this.state.selectedEmployees.filter(
              (employee) => employee !== e
            ),
          });
        }
      );
    }
  }

  handleSegmentClicked(e) {
    const { classList } = e.target;

    const { segment } = e.target.dataset;
    if (segment === "added") {
      this.setState({ isAdding: false });
    } else if (segment === "search") {
      this.setState({ isAdding: true });
    }
  }

  saveEmployeesAdded() {
    let addedEmployeeIDs = this.state.selectedEmployees.map(
      (employee) => employee.id
    );
    //TODO: later retrive this id from main main container
    let postObject = {
      projectID: localStorage.getItem("currentProjectID"),
      employeesArray: addedEmployeeIDs,
    };
    this.props.addEmployeesToProject(postObject, this.props.history);
    this.props.nextClicked();
  }

  createEmployeeElements(dataArray, buttonTitle) {
    let tempEmployeeItems = dataArray.map((employee) => (
      // <Cell
      //   key={employee.id}
      //   title={employee.fullName}
      //   description={employee.email}
      //   data-index={employee.id}
      //   rightSide={
      //     <button onClick={() => this.handler(employee)}>{buttonTitle}</button>
      //   }
      // ></Cell>
      <Cell
        key={employee.id}
        title={employee.fullName}
        description={employee.email}
        data-index={employee.id}
        leftSide={
          <div style={{ textAlign: "center" }}>
            <svg
              style={{ width: "50%" }}
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="user-alt"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-user-alt fa-w-16 fa-9x"
            >
              <path
                fill="currentColor"
                d="M384 336c-40.6 0-47.6-1.5-72.2 6.8-17.5 5.9-36.3 9.2-55.8 9.2s-38.3-3.3-55.8-9.2c-24.6-8.3-31.5-6.8-72.2-6.8C57.3 336 0 393.3 0 464v16c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-16c0-70.7-57.3-128-128-128zm80 128H48c0-21.4 8.3-41.5 23.4-56.6C86.5 392.3 106.6 384 128 384c41.1 0 41-1.1 56.8 4.2 23 7.8 47 11.8 71.2 11.8 24.2 0 48.2-4 71.2-11.8 15.8-5.4 15.7-4.2 56.8-4.2 44.1 0 80 35.9 80 80zM256 320c88.4 0 160-71.6 160-160S344.4 0 256 0 96 71.6 96 160s71.6 160 160 160zm0-272c61.8 0 112 50.2 112 112s-50.2 112-112 112-112-50.2-112-112S194.2 48 256 48z"
                class=""
              ></path>
            </svg>
          </div>
        }
        rightSide={
          <div
            style={{
              width: "100%",
              // border: "1px solid red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => this.handler(employee)}
              style={{ width: "50%" }}
            >
              {this.state.isAdding ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <g>
                    <path
                      fill="green"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276a12 12 0 0 1-12 12h-92v92a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12v-92h-92a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h92v-92a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v92h92a12 12 0 0 1 12 12z"
                    ></path>
                    <path
                      fill="white"
                      d="M400 284a12 12 0 0 1-12 12h-92v92a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12v-92h-92a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h92v-92a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v92h92a12 12 0 0 1 12 12z"
                    ></path>
                  </g>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <g class="fa-group">
                    <path
                      fill="#ff4f60"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276a12 12 0 0 1-12 12H124a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h264a12 12 0 0 1 12 12z"
                    ></path>
                    <path
                      fill="white"
                      d="M400 284a12 12 0 0 1-12 12H124a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h264a12 12 0 0 1 12 12z"
                    ></path>
                  </g>
                </svg>
              )}
            </div>
          </div>
        }
      ></Cell>
    ));
    // this.setState({ employeeElements: tempEmployeeItems });
    return tempEmployeeItems;
  }

  //TODO: create function to create lements and calle the respective one based on state
  render() {
    let employeeElements = [];
    if (this.state.isAdding && this.state.isTyping) {
      employeeElements = this.createEmployeeElements(
        this.state.searchData,
        "Add"
      );
    }

    if (this.state.isAdding && !this.state.isTyping) {
      employeeElements = this.createEmployeeElements(
        this.state.nonSelectedEmployees,
        "Add"
      );
    }

    if (!this.state.isAdding && this.state.isTyping) {
      employeeElements = this.createEmployeeElements(
        this.state.searchData,
        "Remove"
      );
    }
    if (!this.state.isAdding && !this.state.isTyping) {
      employeeElements = this.createEmployeeElements(
        this.state.selectedEmployees,
        "Remove"
      );
    }
    return (
      <div>
        <div className="container">
          <h2 style={{ width: "100%", textAlign: "center" }}>Your Employees</h2>
          <TextField
            name="search"
            placeholder="Search for employees"
            onChange={this.searchHandler}
            value={this.state.searchTerm}
            onFocus={() => {
              this.setState({ isTyping: true });
            }}
            onBlur={() => {
              this.setState({ isTyping: false });
            }}
          ></TextField>
          <SegmentedControl
            onClick={this.handleSegmentClicked}
          ></SegmentedControl>
          <div
            style={{
              maxHeight: "700px",
              whiteSpace: "nowrap",
              overflowY: "auto",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              backgroundColor: "#5a5a5a",
            }}
          >
            <button
              className="button"
              style={{
                width: "90%",
                margin: "10px",
                backgroundColor: "#dedede",
                color: "black",
              }}
              onClick={this.addRemoveEmployees}
            >
              Add All Employees
            </button>
            {employeeElements}
          </div>
        </div>

        <div className="simple-container">
          <button
            className="button"
            type="submit"
            onClick={() => {
              this.props.prevClicked();
            }}
          >
            Previous
          </button>
          <button
            className="button"
            type="submit"
            onClick={this.saveEmployeesAdded}
          >
            Save and Continue
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStateToProps, {
  addEmployeesToProject,
})(ProjectSetupEmployees);

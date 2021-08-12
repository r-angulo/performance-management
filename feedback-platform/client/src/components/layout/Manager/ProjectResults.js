import React, { Component } from "react";
import { connect } from "react-redux";
import Results from "../Employee/Results";
import axios from "axios";
import Spinner from "../../display/Spinner";
//TODO: note id is hard coded
//NOTe: I DONT THINK NEXT IS WORKINg, proiably has to do somdthing with forced update
class ProjectResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeID: "",
      projectEmployees: [],
      currentIndex: 0,
      isLoading: true,
    };
  }

  ///TODO: this is a lazy way of doing it bc it fetches for other data too not fast and change force update
  getSubordinates() {
    axios
      .get(
        "/api/manager/project/employees/" + this.props.match.params.projectID
      )
      .then((res) => {
        this.setState(
          { projectEmployees: res.data.addedEmployees, isLoading: false },
          () => {
            this.forceUpdate();
          }
        );
      })
      .catch((err) => {});
  }

  componentDidMount() {
    this.getSubordinates();
  }

  changeEmployee(step) {
    let len = this.state.projectEmployees.length;
    let newIndex = this.state.currentIndex;

    if (step === -1) {
      if (this.state.currentIndex === 0) {
        newIndex = len - 1;
      } else {
        newIndex = this.state.currentIndex - 1;
      }
    }

    if (step === 1) {
      if (this.state.currentIndex === len - 1) {
        newIndex = 0;
      } else {
        newIndex = this.state.currentIndex + 1;
      }
    }
    this.setState({ currentIndex: newIndex });
  }

  render() {
    if (this.state.projectEmployees[this.state.currentIndex]) {
      console.log(this.state.projectEmployees[this.state.currentIndex].id);
    }
    console.log(
      this.state.projectEmployees[this.state.currentIndex]
        ? this.state.projectEmployees[this.state.currentIndex].id
        : "rgf"
    );

    return (
      <div>
        <div className="container">
          <button
            style={{ backgroundColor: "inherit", border: "none" }}
            onClick={() => {
              this.changeEmployee(-1);
            }}
          >
            <svg
              style={{ width: "30px" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-chevron-circle-left fa-w-16 fa-7x"
            >
              <path
                fill="dodgerblue"
                d="M272 157.1v197.8c0 10.7-13 16.1-20.5 8.5l-98.3-98.9c-4.7-4.7-4.7-12.2 0-16.9l98.3-98.9c7.5-7.7 20.5-2.3 20.5 8.4zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
              ></path>
            </svg>
          </button>
          <h2>
            {this.state.projectEmployees[this.state.currentIndex]
              ? this.state.projectEmployees[this.state.currentIndex].fullName
              : ""}
          </h2>
          <button
            style={{ backgroundColor: "inherit", border: "none" }}
            onClick={() => {
              this.changeEmployee(1);
            }}
          >
            <svg
              style={{ width: "30px" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-chevron-circle-left fa-w-16 fa-7x"
            >
              <path
                fill="dodgerblue"
                d="M176 354.9V157.1c0-10.7 13-16.1 20.5-8.5l98.3 98.9c4.7 4.7 4.7 12.2 0 16.9l-98.3 98.9c-7.5 7.7-20.5 2.3-20.5-8.4zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
              ></path>
            </svg>
          </button>
        </div>
        {this.state.isLoading ? (
          <Spinner></Spinner>
        ) : (
          <Results
            match={{ params: { projectID: this.props.match.params.projectID } }}
            auth={{
              user: {
                id: this.props.auth.user.id ? this.props.auth.user.id : null,
              },
            }}
            userID={
              this.state.projectEmployees[this.state.currentIndex]
                ? this.state.projectEmployees[this.state.currentIndex].id
                : ""
            }
          ></Results>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectResults);

import { connect } from "react-redux";
import React, { Component } from "react";
import TextField from "../../display/TextField";
import SegmentedControl from "../../display/SegmentedControl";
import Cell from "../../display/Cell";
import axios from "axios";
import Spinner from "../../display/Spinner";
import { updateNavTitle } from "../../../actions/navActions";

//NOTE: can assigned self, fix in backend
//TODO: fix button image
class EditRelation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      managerName: "",
      subordinates: [],
      nonSubordinates: [],
      isLoading: true,

      isAdding: true,
      searchTerm: "",
    };
    this.handleSegmentClicked = this.handleSegmentClicked.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.handleButtonClicked = this.handleButtonClicked.bind(this);
    this.updateSubordinates = this.updateSubordinates.bind(this);
  }
  getSubordinatesData() {
    console.log(this.props.auth.user.id);
    axios
      .get("/api/admin/subordinates/" + this.props.match.params.id)
      .then((res) => {
        console.log(res.data);
        this.setState({
          managerName: res.data.managerName,
          subordinates: res.data.subordinates,
          nonSubordinates: res.data.nonSubordinates,
          isLoading: false,
        });
      })

      .catch((err) => console.log("failed to get subordinate data"));
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

  searchHandler(e) {
    this.setState({ searchTerm: e.target.value });
  }

  componentDidMount() {
    this.getSubordinatesData();
    this.props.updateNavTitle("Edit Hierarchy");
  }

  handleButtonClicked(e) {
    this.setState({ searchTerm: "" });
    if (this.state.isAdding) {
      let newList = this.state.nonSubordinates.filter(
        (employee) => employee !== e
      );
      this.setState({ nonSubordinates: newList }, () => {
        this.setState({ subordinates: [...this.state.subordinates, e] });
      });
    } else {
      let newList = this.state.subordinates.filter(
        (employee) => employee !== e
      );
      this.setState({ subordinates: newList }, () => {
        this.setState({ nonSubordinates: [...this.state.nonSubordinates, e] });
      });
    }
  }

  updateSubordinates() {
    console.log(this.props.auth.user.id);
    console.log(this.state.subordinates);
    axios
      .post("/api/admin/subordinates/" + this.props.match.params.id, {
        subordinatesIDs: this.state.subordinates.map((e) => e.id),
      })
      .then((res) => this.props.history.push("/allmanagers"))
      .catch((err) =>
        console.log("error occured while updating subordinates: " + err)
      );
  }
  render() {
    let displayData;
    if (this.state.isAdding) {
      displayData = this.state.nonSubordinates;
    } else {
      displayData = this.state.subordinates;
    }

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
    let displayElements = displayData.map((employee) => (
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
              onClick={() => this.handleButtonClicked(employee)}
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

    return (
      <div>
        <div className="container">
          {this.state.isLoading ? (
            <Spinner></Spinner>
          ) : (
            <React.Fragment>
              <h2>{this.state.managerName}'s Employees</h2>
              <TextField
                name="search"
                placeholder="Search for employees"
                onChange={this.searchHandler}
                value={this.state.searchTerm}
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
                {displayElements}
              </div>
            </React.Fragment>
          )}
        </div>

        <div className="simple-container  ">
          <button
            type="button"
            className="button inverted-button"
            onClick={() => {
              this.props.history.push("/allmanagers");
            }}
          >
            Go Back
          </button>
          <button
            type="submit"
            className="button"
            onClick={this.updateSubordinates}
          >
            Update
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, { updateNavTitle })(EditRelation);

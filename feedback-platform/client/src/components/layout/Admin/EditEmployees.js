import React, { Component } from "react";
import TextField from "../../display/TextField";
import Cell from "../../display/Cell";
import { getEmployeesToEdit } from "../../../actions/adminActions";
import { updateNavTitle } from "../../../actions/navActions";
import { connect } from "react-redux";
import "../../../css/global.css";
import Spinner from "../../display/Spinner";
import axios from "axios";
import ToggableButton from "../../display/ToggableButton";

//TODO: not for larger applications, you have to search qury for employee bc it will not have all loaded
//TODO: consider changing the content size to make it as big as the screen and slider on the side
//TODO: how will this look like if many many employees
//TODO: eventually turn this into media casrds from codepen https://codepen.io/topic/card/picks?cursor=ZD0wJm89MSZwPTEmdj00OTg2OTcy
//TODO: this has no back button
class EditEmployees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allEmployeesData: [],
      searchTerm: "",
      isLoading: true,
      isAlphabetical: false,
      isDisplayingRankAndFiles: false,
      isDisplayingManagers: false,
      isDisplayingAdmins: false,
    };
  }

  componentDidMount() {
    axios
      .get("/api/admin/allemployees")
      .then((res) => {
        this.setState({ allEmployeesData: res.data, isLoading: false });
      })
      .catch((err) => {
        console.log("error fetching employees: " + err);
      });
    this.props.updateNavTitle("Edit Employees");
  }

  handler(e) {
    this.props.history.push("/editemployee/" + e);
  }

  sortAlphabetically() {
    this.setState({ isAlphabetical: !this.state.isAlphabetical }, () => {
      let _allEmployeesData = this.state.allEmployeesData;
      if (this.state.isAlphabetical) {
        _allEmployeesData.sort((a, b) =>
          a.fullName > b.fullName ? 1 : b.fullName > a.fullName ? -1 : 0
        );
      } else {
        _allEmployeesData.sort((a, b) =>
          a.fullName > b.fullName ? -1 : b.fullName > a.fullName ? 1 : 0
        );
      }
      this.setState({ allEmployeesData: _allEmployeesData });
    });
  }

  render() {
    let displayData = this.state.allEmployeesData;
    if (this.state.isDisplayingRankAndFiles) {
      displayData = displayData.filter(
        (employee) =>
          employee.levels.includes("employee") &&
          !employee.levels.includes("manager") &&
          !employee.levels.includes("admin")
      );
    }
    if (this.state.isDisplayingManagers) {
      displayData = displayData.filter((employee) =>
        employee.levels.includes("manager")
      );
    }
    if (this.state.isDisplayingAdmins) {
      displayData = displayData.filter((employee) =>
        employee.levels.includes("admin")
      );
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
    let tempEmployeeItems = displayData.map((employee) => (
      <Cell
        key={employee._id}
        title={`${employee.fullName} (${employee.email}) `}
        description={employee.levels.join(" ᛫ ")}
        data-index={employee._id}
        onClick={() => this.handler(employee._id)}
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
      ></Cell>
    ));
    return (
      <div className="container">
        {tempEmployeeItems === null ||
        (tempEmployeeItems.length === 0 && this.state.isLoading) ? (
          <Spinner></Spinner>
        ) : (
          <React.Fragment>
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
              <ToggableButton
                title={"Sort Alphabetically by Name"}
                altTitle={"Reverse Sort Alphabetically by Name"}
                svgData={
                  "M16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160zm400 128H288a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h56l-61.26 70.45A32 32 0 0 0 272 446.37V464a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-56l61.26-70.45A32 32 0 0 0 432 321.63V304a16 16 0 0 0-16-16zm31.06-85.38l-59.27-160A16 16 0 0 0 372.72 32h-41.44a16 16 0 0 0-15.07 10.62l-59.27 160A16 16 0 0 0 272 224h24.83a16 16 0 0 0 15.23-11.08l4.42-12.92h71l4.41 12.92A16 16 0 0 0 407.16 224H432a16 16 0 0 0 15.06-21.38zM335.61 144L352 96l16.39 48z"
                }
                altSvgData={
                  "M176 352h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.36 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm112-128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-56l61.26-70.45A32 32 0 0 0 432 65.63V48a16 16 0 0 0-16-16H288a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h56l-61.26 70.45A32 32 0 0 0 272 190.37V208a16 16 0 0 0 16 16zm159.06 234.62l-59.27-160A16 16 0 0 0 372.72 288h-41.44a16 16 0 0 0-15.07 10.62l-59.27 160A16 16 0 0 0 272 480h24.83a16 16 0 0 0 15.23-11.08l4.42-12.92h71l4.41 12.92A16 16 0 0 0 407.16 480H432a16 16 0 0 0 15.06-21.38zM335.61 400L352 352l16.39 48z"
                }
                viewBox={"0 0 448 512"}
                altViewBox={"0 0 448 512"}
                onClick={() => {
                  this.sortAlphabetically();
                }}
              ></ToggableButton>

              <ToggableButton
                title={"Show All Rank-and-Files"}
                altTitle={"Show Everyone"}
                svgData={
                  "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                }
                altSvgData={
                  "M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
                }
                viewBox={"0 0 448 512"}
                altViewBox={"0 0 640 512"}
                onClick={() => {
                  this.setState({
                    isDisplayingRankAndFiles: !this.state
                      .isDisplayingRankAndFiles,
                  });
                }}
              ></ToggableButton>
              <ToggableButton
                title={"Show All Managers"}
                altTitle={"Show Everyone"}
                svgData={
                  "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z"
                }
                altSvgData={
                  "M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
                }
                viewBox={"0 0 448 512"}
                altViewBox={"0 0 640 512"}
                onClick={() => {
                  this.setState({
                    isDisplayingManagers: !this.state.isDisplayingManagers,
                  });
                }}
              ></ToggableButton>
              <ToggableButton
                title={"Show All Administrators"}
                altTitle={"Show Everyone"}
                svgData={
                  "M352 0l-64 32-64-32-64 32L96 0v96h256V0zm-38.4 304h-16.71c-22.24 10.18-46.88 16-72.89 16s-50.65-5.82-72.89-16H134.4C60.17 304 0 364.17 0 438.4V464c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48v-25.6c0-74.23-60.17-134.4-134.4-134.4zM224 272c70.69 0 128-57.31 128-128v-16H96v16c0 70.69 57.31 128 128 128z"
                }
                altSvgData={
                  "M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
                }
                viewBox={"0 0 448 512"}
                altViewBox={"0 0 640 512"}
                onClick={() => {
                  this.setState({
                    isDisplayingAdmins: !this.state.isDisplayingAdmins,
                  });
                }}
              ></ToggableButton>
            </div>
            {tempEmployeeItems.length === 0 && (
              <h4>Sorry, no employees found :(</h4>
            )}
            {tempEmployeeItems}
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
  nav: state.nav,
});
export default connect(mapStateToProps, { getEmployeesToEdit, updateNavTitle })(
  EditEmployees
);

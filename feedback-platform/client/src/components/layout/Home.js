import React, { Component } from "react";
import { connect } from "react-redux";
import AdminHome from "./Admin/AdminHome";
import EmployeeHome from "./Employee/EmployeeHome";
import ManagerHome from "./Manager/ManagerHome";
import { updateNavTitle } from "../../actions/navActions";

class Home extends Component {
  componentDidMount() {
    this.props.updateNavTitle("{Company Name}|Happy Worker");
  }

  render() {
    const { currentAccountLevel } = this.props.auth.user;

    return (
      <React.Fragment>
        {currentAccountLevel === "employee" ? (
          <EmployeeHome></EmployeeHome>
        ) : null}
        {currentAccountLevel === "manager" ? <ManagerHome></ManagerHome> : null}
        {currentAccountLevel === "admin" ? <AdminHome></AdminHome> : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, { updateNavTitle })(Home);

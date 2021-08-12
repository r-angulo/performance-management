import { connect } from "react-redux";
import React, { Component } from "react";
import HeaderDescription from "../../display/HeaderDescription";
import Cell from "../../display/Cell";
import { getPeersForThisProject } from "../../../actions/employeeActions";
import { updateNavTitle } from "../../../actions/navActions";

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: "",
      projectDescription: "",
      peersData: [],
    };

    this.handleEmployeeClicked = this.handleEmployeeClicked.bind(this);
  }

  componentDidMount() {
    let queryObj = {
      projID: this.props.match.params.projectID,
      currUser: this.props.auth.user.id,
    };
    this.props.getPeersForThisProject(queryObj);
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    this.setState({ projectName: newProps.employee.thisProjectPeers.projName });
    this.setState({
      projectDescription: newProps.employee.thisProjectPeers.projDescription,
    });
    this.setState({ peersData: newProps.employee.thisProjectPeers.employees });
  }

  handleEmployeeClicked(toID) {
    localStorage.setItem("projectName", this.state.projectName);
    localStorage.setItem("projID", this.props.match.params.projectID);
    localStorage.setItem("fromID", this.props.auth.user.id);
    localStorage.setItem("toID", toID);
    this.props.history.push({
      pathname: "/score",
      projectName: this.state.projectName,
      projID: this.props.match.params.projectID,
      fromID: this.props.auth.user.id,
      toID: toID,
    });
  }

  render() {
    console.log(this.state);

    const peersCells = this.state.peersData.map((employee) => {
      return (
        <Cell
          key={employee.empID}
          title={employee.fullName}
          description={(employee.completion * 100).toFixed(2) + "% complete"}
          // data-index={employee._id}
          onClick={() => this.handleEmployeeClicked(employee.empID)}
        ></Cell>
      );
    });
    return (
      <React.Fragment>
        <HeaderDescription
          title={this.state.projectName}
          description={this.state.projectDescription}
        ></HeaderDescription>
        <div className="container">{peersCells}</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  employee: state.employee,
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, {
  getPeersForThisProject,
  updateNavTitle,
})(Project);
